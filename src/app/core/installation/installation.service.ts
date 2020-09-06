import { Injectable } from '@angular/core';
import { InstancesService } from '@providers';
import {
  BehaviorSubject,
  combineLatest,
  concat,
  forkJoin,
  Observable,
  of,
  throwError,
} from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  first,
  map,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';
import { InstallationStore } from 'src/app/core/installation/installation.store';
import { FileSystemService } from './file-system.service';

@Injectable({
  providedIn: 'root',
})
export class InstallationService {
  public gamePath$ = this.fileSystem.gamePath$;

  private readonly scriptFilename = this.fileSystem.scriptFilename;
  private readonly styleFilename = this.fileSystem.styleFilename;

  private readonly progress = new BehaviorSubject({
    currentStep: 0,
    totalStep: 100,
    progress: 0,
  });

  public progress$ = this.progress.asObservable().pipe(
    map((value) => value.progress),
    distinctUntilChanged(),
  );

  constructor(
    private fileSystem: FileSystemService,
    private store: InstallationStore,
    private instances: InstancesService,
  ) {}

  installAssets() {
    this.instances.removeAllInstances();
    this.progress.next({
      currentStep: 0,
      progress: 0,
      totalStep: 2,
    });

    this.store.setFileSystemBusiness(true);
    this.store.setAssetsReady(false);

    const manifest = this.fileSystem.getRemoteAssetMap().pipe(
      tap(() => this.updateProgress()),
      shareReplay(),
    );
    const assets = manifest.pipe(
      map((obj) => getMissingFiles(obj)),
      tap((files) => this.updateProgress(0, files.length)),
    );

    const assetsOperations = assets.pipe(
      switchMap((files) => this.installRemoteFiles(files)),
    );

    const manifestOperation = manifest.pipe(
      switchMap((content) => this.fileSystem.writeAssetMap(content)),
      tap(() => this.updateProgress()),
    );

    return forkJoin([concat(assetsOperations, manifestOperation)]).pipe(
      tap(() => this.store.setFileSystemBusiness(false)),
      tap(() => this.store.setAssetsReady(true)),
      this.manageError(),
    );
  }

  installBuild() {
    this.instances.removeAllInstances();
    this.progress.next({
      currentStep: 0,
      progress: 0,
      totalStep: 5,
    });

    this.store.setFileSystemBusiness(true);
    this.store.setBuildReady(false);
    const manifest = this.fileSystem.getRemoteManifest().pipe(
      tap(() => this.updateProgress()),
      shareReplay(),
    );
    const buildFiles = manifest.pipe(map((obj) => getMissingFiles(obj)));

    const operations = [
      manifest.pipe(
        switchMap((v) => this.fileSystem.writeManifest(v)),
        tap(() => this.updateProgress()),
      ),
      buildFiles.pipe(switchMap((files) => this.installRemoteFiles(files))),
      this.fileSystem.editScript().pipe(tap(() => this.updateProgress())),
      this.fileSystem.editStyle().pipe(tap(() => this.updateProgress())),
      this.fileSystem.installMocks().pipe(tap(() => this.updateProgress())),
    ];

    return forkJoin([concat(...operations)]).pipe(
      tap(() => this.store.setFileSystemBusiness(false)),
      tap(() => this.store.setBuildReady(true)),
      this.manageError(),
    );
  }

  updateGame() {
    this.instances.removeAllInstances();
    this.progress.next({
      currentStep: 0,
      totalStep: 9,
      progress: 0,
    });

    this.store.setFileSystemBusiness(true);
    const UNNEEDED_KEY = '#UNNEEDED';

    const _remoteManifest = this.fileSystem.getRemoteManifest().pipe(
      tap(() => this.updateProgress()),
      shareReplay(),
    );
    const _remoteAssetMap = this.fileSystem.getRemoteAssetMap().pipe(
      tap(() => this.updateProgress()),
      shareReplay(),
    );

    const _localManifest = this.fileSystem.getLocalManifest().pipe(
      tap(() => this.updateProgress()),
      shareReplay(),
    );
    const _localAssetMap = this.fileSystem.getLocalAssetMap().pipe(
      tap(() => this.updateProgress()),
      shareReplay(),
    );

    const _buildFiles = combineLatest([_remoteManifest, _localManifest]).pipe(
      map(([remote, local]) => getMissingFiles(remote, local)),
      tap((files) => this.updateProgress(0, files.length)),
      shareReplay(),
    );
    const _assetFiles = combineLatest([_remoteAssetMap, _localAssetMap]).pipe(
      map(([remote, local]) => getMissingFiles(remote, local)),
      tap((files) => this.updateProgress(0, files.length)),
      shareReplay(),
    );

    const _updateScript = _buildFiles.pipe(
      switchMap((files) =>
        files.some((f) => f.filename === this.scriptFilename)
          ? this.fileSystem.editScript()
          : of(UNNEEDED_KEY),
      ),
      tap(() => this.updateProgress()),
    );

    const _updateStyle = _buildFiles.pipe(
      switchMap((files) =>
        files.some((f) => f.filename === this.styleFilename)
          ? this.fileSystem.editStyle()
          : of(UNNEEDED_KEY),
      ),
      tap(() => this.updateProgress()),
    );

    const downloadBuild = _buildFiles.pipe(
      switchMap((files) => this.installRemoteFiles(files)),
    );

    const downloadAssets = _assetFiles.pipe(
      switchMap((files) => this.installRemoteFiles(files)),
      this.manageError(true),
    );

    const updateManifest = combineLatest([_buildFiles, _remoteManifest]).pipe(
      switchMap(([files, manifest]) =>
        files.length
          ? this.fileSystem.writeManifest(manifest)
          : of(UNNEEDED_KEY),
      ),
      first(),
      tap(() => this.updateProgress()),
    );

    const updateAssetMap = combineLatest([_assetFiles, _remoteAssetMap]).pipe(
      switchMap(([files, manifest]) =>
        files.length
          ? this.fileSystem.writeAssetMap(manifest)
          : of(UNNEEDED_KEY),
      ),
      first(),
      tap(() => this.updateProgress()),
    );

    const installMocks = forkJoin([_updateScript, _updateStyle]).pipe(
      switchMap((updates) =>
        updates.every((u) => u === UNNEEDED_KEY)
          ? of(UNNEEDED_KEY)
          : this.fileSystem.installMocks(),
      ),
      tap(() => this.updateProgress()),
    );

    return forkJoin([
      concat(
        downloadAssets,
        downloadBuild,
        updateManifest,
        updateAssetMap,
        installMocks,
      ),
    ]).pipe(
      tap(() => this.store.setGameUpdatedStatus(true)),
      tap(() => this.store.setFileSystemBusiness(false)),
      this.manageError(),
    );
  }

  private installRemoteFiles(files: FileItem[]) {
    const fileUpdateOperations = files.map((file, index) =>
      this.fileSystem.updateGameFile(file.filename).pipe(
        // tap(() => console.log(`${index} - ${file.filename}`)),
        tap(() => this.updateProgress()),
        this.manageError(),
      ),
    );

    return forkJoin([concat(...fileUpdateOperations)]);
  }

  private manageError<T>(ignore404s = false) {
    return catchError<T, Observable<T>>((error) => {
      if (ignore404s && error?.status !== 404)
        this.store.setInstallError(JSON.stringify(error, null, 4));
      return ignore404s && error?.status === 404
        ? of<T>(false as any)
        : throwError(error);
    });
  }

  private updateProgress(current = 1, total = 0) {
    const currentStep = this.progress.value.currentStep + current;
    const totalStep = this.progress.value.totalStep + total;

    this.progress.next({
      currentStep,
      totalStep,
      progress: Math.ceil((currentStep * 100) / (totalStep || 1)),
    });
  }
}

function getMissingFiles(
  firstManifest: Manifest,
  secondManifest: Manifest = { files: {} },
): FileItem[] {
  const arrayOne = Object.values(firstManifest.files);
  const arrayTwo = Object.values(secondManifest.files);
  const [smaller, longer] = [arrayOne, arrayTwo].sort(
    (a, b) => a.length - b.length,
  );
  return longer.filter(
    (item) =>
      !smaller.some(
        (compareItem) =>
          item.filename === compareItem.filename &&
          item.version === compareItem.version,
      ),
  );
}
