import { Injectable } from '@angular/core';
import {
  combineLatest,
  concat,
  forkJoin,
  Observable,
  of,
  throwError,
} from 'rxjs';
import {
  catchError,
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

  constructor(
    private fileSystem: FileSystemService,
    private store: InstallationStore,
  ) {}

  installAssets() {
    this.store.setFileSystemBusiness(true);

    const manifest = this.fileSystem.getRemoteAssetMap().pipe(shareReplay());
    const assets = manifest.pipe(map((obj) => getMissingFiles(obj)));

    const assetsOperations = assets.pipe(
      switchMap((files) => this.installRemoteFiles(files)),
    );

    const manifestOperation = manifest.pipe(
      switchMap((content) => this.fileSystem.writeAssetMap(content)),
    );

    return forkJoin([concat(assetsOperations, manifestOperation)]).pipe(
      tap(() => this.store.setFileSystemBusiness(false)),
      this.manageError(),
    );
  }

  installBuild() {
    this.store.setFileSystemBusiness(true);
    const manifest = this.fileSystem.getRemoteManifest().pipe(shareReplay());
    const buildFiles = manifest.pipe(map((obj) => getMissingFiles(obj)));

    const operations = [
      manifest.pipe(switchMap((v) => this.fileSystem.writeManifest(v))),
      buildFiles.pipe(switchMap((files) => this.installRemoteFiles(files))),
      this.fileSystem.editScript(),
      this.fileSystem.editStyle(),
      this.fileSystem.installMocks(),
    ];

    return forkJoin([concat(...operations)]).pipe(
      tap(() => this.store.setFileSystemBusiness(false)),
      this.manageError(),
    );
  }

  updateGame() {
    this.store.setFileSystemBusiness(true);
    const UNNEEDED_KEY = '#UNNEEDED';

    const _remoteManifest = this.fileSystem
      .getRemoteManifest()
      .pipe(shareReplay());
    const _remoteAssetMap = this.fileSystem
      .getRemoteAssetMap()
      .pipe(shareReplay());

    const _localManifest = this.fileSystem
      .getLocalManifest()
      .pipe(shareReplay());
    const _localAssetMap = this.fileSystem
      .getLocalAssetMap()
      .pipe(shareReplay());

    const _buildFiles = combineLatest([_remoteManifest, _localManifest]).pipe(
      map(([remote, local]) => getMissingFiles(remote, local)),
      shareReplay(),
    );
    const _assetFiles = combineLatest([_remoteAssetMap, _localAssetMap]).pipe(
      map(([remote, local]) => getMissingFiles(remote, local)),
      shareReplay(),
    );

    const _updateScript = _buildFiles.pipe(
      switchMap((files) =>
        files.some((f) => f.filename === this.scriptFilename)
          ? this.fileSystem.editScript()
          : of(UNNEEDED_KEY),
      ),
    );

    const _updateStyle = _buildFiles.pipe(
      switchMap((files) =>
        files.some((f) => f.filename === this.styleFilename)
          ? this.fileSystem.editStyle()
          : of(UNNEEDED_KEY),
      ),
    );

    const downloadBuild = _buildFiles.pipe(
      switchMap((files) => this.installRemoteFiles(files)),
    );

    const downloadAssets = _assetFiles.pipe(
      switchMap((files) => this.installRemoteFiles(files)),
    );

    const updateManifest = combineLatest([_buildFiles, _remoteManifest]).pipe(
      switchMap(([files, manifest]) =>
        files.length
          ? this.fileSystem.writeManifest(manifest)
          : of(UNNEEDED_KEY),
      ),
      first(),
    );

    const updateAssetMap = combineLatest([_assetFiles, _remoteAssetMap]).pipe(
      switchMap(([files, manifest]) =>
        files.length
          ? this.fileSystem.writeAssetMap(manifest)
          : of(UNNEEDED_KEY),
      ),
      first(),
    );

    const installMocks = forkJoin([_updateScript, _updateStyle]).pipe(
      switchMap((updates) =>
        updates.every((u) => u === UNNEEDED_KEY)
          ? of(UNNEEDED_KEY)
          : this.fileSystem.installMocks(),
      ),
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
      this.fileSystem
        .updateGameFile(file.filename)
        .pipe(tap(() => console.log(`${index} - ${file.filename}`))),
    );

    return forkJoin([concat(...fileUpdateOperations)]);
  }

  private manageError<T>() {
    return catchError<T, Observable<T>>((error) => {
      this.store.setInstallError(error);
      return throwError(error);
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
