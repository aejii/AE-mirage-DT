import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concat, forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, first, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { commonEnvironment } from 'src/environments/environment.common';
import { MirageFileSystemImplementation } from './file-system.implementation';

@Injectable({
  providedIn: 'root',
})
export class FileSystemService implements MirageFileSystemImplementation {
  public readonly scriptFilename = commonEnvironment.scriptFilename;
  public readonly styleFilename = commonEnvironment.styleFilename;

  // Local file system, the one used by the game itself
  private readonly fileSystem$: Observable<FileSystem> = new Observable<
    FileSystem
  >(handler =>
    window.requestFileSystem(
      LocalFileSystem.PERSISTENT,
      0,
      fs => handler.next(fs),
      error => handler.error(error),
    ),
  ).pipe(shareReplay());

  // Directory where the game is going to be stored, along with the manifests
  private readonly dataDir$: Observable<DirectoryEntry> = this.fileSystem$.pipe(
    switchMap(fs => this.openFolder(fs.root, 'data')),
    shareReplay(),
  );

  // Directory of the game mocking files
  private readonly assetsDir$ = new Observable<DirectoryEntry>(handler => {
    window.resolveLocalFileSystemURL(
      cordova.file.applicationDirectory + 'www/assets',
      (fs: DirectoryEntry) => handler.next(fs),
      error => handler.error(error),
    );
  }).pipe(shareReplay());

  // path of the index.html file to run a game instance
  public gamePath$ = this.dataDir$.pipe(
    map(dir => dir.toURL() + 'index.html'),
  );

  constructor(private http: HttpClient) {}

  getLocalManifest(): Observable<Manifest> {
    return this.dataDir$.pipe(
      switchMap(dir => this.getFile(dir, commonEnvironment.manifestFilename)),
      switchMap(file => this.readFileContent(file)),
      map(fileContent => JSON.parse(fileContent)),
      catchError(error =>
        error.code === commonEnvironment.cordovaErrors.files.notFound
          ? of<Manifest>({ files: {} })
          : throwError(error),
      ),
      first(),
    );
  }

  getLocalAssetMap(): Observable<Manifest> {
    return this.dataDir$.pipe(
      switchMap(dir => this.getFile(dir, commonEnvironment.assetMapFilename)),
      switchMap(file => this.readFileContent(file)),
      map(fileContent => JSON.parse(fileContent)),
      catchError(error =>
        error.code === commonEnvironment.cordovaErrors.files.notFound
          ? of<Manifest>({ files: {} })
          : throwError(error),
      ),
      first(),
    );
  }

  getRemoteManifest() {
    return this.http.get<Manifest>(
      commonEnvironment.dofusTouchProxy + commonEnvironment.manifestFilename,
    );
  }

  getRemoteAssetMap() {
    return this.http.get<Manifest>(
      commonEnvironment.dofusTouchProxy + commonEnvironment.assetMapFilename,
    );
  }

  updateGameFile(filename: string) {
    return this.getRemoteFileBlob(filename).pipe(
      switchMap(blob => this.writeAssetFile(filename, blob)),
    );
  }

  writeManifest(fileContent: Manifest): Observable<void> {
    return this.dataDir$.pipe(
      switchMap(dir =>
        this.getFile(dir, commonEnvironment.manifestFilename, {
          create: true,
          exclusive: false,
        }),
      ),
      switchMap(file =>
        this.writeFile(file, JSON.stringify(fileContent, null, 4)),
      ),
      first(),
    );
  }

  writeAssetMap(fileContent: Manifest): Observable<void> {
    return this.dataDir$.pipe(
      switchMap(dir =>
        this.getFile(dir, commonEnvironment.assetMapFilename, {
          create: true,
          exclusive: false,
        }),
      ),
      switchMap(file =>
        this.writeFile(file, JSON.stringify(fileContent, null, 4)),
      ),
      first(),
    );
  }

  editScript() {
    return this.applyRegexes(commonEnvironment.scriptFilename, scriptRegexes);
  }

  editStyle() {
    return this.applyRegexes(commonEnvironment.styleFilename, styleRegexes);
  }

  installMocks() {
    const scriptContent$ = this.assetsDir$.pipe(
      switchMap(entry => this.getFile(entry, commonEnvironment.scriptMockFile)),
      switchMap(file => this.readFileContent(file)),
      switchMap(content =>
        this.getAppVersion().pipe(
          map(version =>
            content.replace(commonEnvironment.appVersionPlaceholder, version),
          ),
        ),
      ),
      switchMap(content =>
        this.getBuildVersion().pipe(
          map(version =>
            content.replace(commonEnvironment.appVersionPlaceholder, version),
          ),
        ),
      ),
      first(),
    );

    const indexContent$ = this.assetsDir$.pipe(
      switchMap(entry => this.getFile(entry, commonEnvironment.indexMockFile)),
      switchMap(file => this.readFileContent(file)),
      first(),
    );

    const styleContent$ = this.assetsDir$.pipe(
      switchMap(entry => this.getFile(entry, commonEnvironment.styleMockFile)),
      switchMap(file => this.readFileContent(file)),
      first(),
    );

    const operations$ = [
      { filename: commonEnvironment.scriptMockFile, content$: scriptContent$ },
      { filename: commonEnvironment.indexMockFile, content$: indexContent$ },
      { filename: commonEnvironment.styleMockFile, content$: styleContent$ },
    ].map(item =>
      this.dataDir$.pipe(
        switchMap(entry =>
          forkJoin([
            this.getFile(entry, item.filename, {
              create: true,
              exclusive: false,
            }),
            item.content$,
          ]),
        ),
        switchMap(([file, content]) => this.writeFile(file, content)),
        first(),
      ),
    );

    return forkJoin([concat(...operations$)]);
  }

  private getAppVersion() {
    return this.http
      .get<any>(commonEnvironment.iTunesManifestUrl)
      .pipe(map(iTunesManifest => iTunesManifest.results[0].version));
  }

  private getBuildVersion() {
    const [dir, file] = commonEnvironment.scriptFilename.split('/');
    return this.dataDir$.pipe(
      switchMap(entry => this.openFolder(entry, dir)),
      switchMap(entry => this.getFile(entry, file)),
      switchMap(entry => this.readFileContent(entry)),
      map(
        scriptContent =>
          commonEnvironment.scriptBuildRegex.exec(scriptContent)[1],
      ),
      first(),
    );
  }

  private getRemoteFileBlob(filename: string): Observable<Blob> {
    return this.http.get(commonEnvironment.dofusTouchProxy + filename, {
      responseType: 'blob',
    });
  }

  // Writes an asset file to the disk based on its path
  private writeAssetFile(
    filepath: string,
    fileContent: Blob,
  ): Observable<void> {
    const dirsToCreate = filepath.split('/');
    const filename = dirsToCreate.pop();

    // Go through all directories, and return the last entry
    const lastDirEntry$ = dirsToCreate.reduce(
      (acc, curr) =>
        acc.pipe(switchMap(dirEntry => this.openFolder(dirEntry, curr))),
      this.dataDir$,
    );

    // From the last directory, create the file
    const result$ = lastDirEntry$.pipe(
      switchMap(entry =>
        this.getFile(entry, filename, { create: true, exclusive: false }),
      ),
      switchMap(file => this.writeFile(file, fileContent)),
      first(),
    );

    return result$;
  }

  // Opens the given filepath and writes the regexes in it, then saves it
  private applyRegexes(filePath: string, regexes: string[][]) {
    const [dirname, filename] = filePath.split('/');

    return this.dataDir$.pipe(
      switchMap(entry => this.openFolder(entry, dirname)),
      switchMap(entry => this.getFile(entry, filename)),
      switchMap(entry => this.readFileContent(entry)),
      map(content =>
        regexes.reduce(
          (newContent, regex) =>
            newContent.replace(new RegExp(regex[0], 'g'), regex[1]),
          content,
        ),
      ),
      switchMap(content =>
        this.writeAssetFile(
          filePath,
          new Blob([content], {
            type: 'text/plain',
          }),
        ),
      ),
      first(),
    );
  }

  /**
   * Opens or, if it does not exist, creates a given folder.
   * @param currentFoler File system folder entry where the wanted folder is located
   * @param folderName Name of the wanted folder to open
   */
  private openFolder(
    currentFoler: DirectoryEntry,
    folderName: string,
  ): Observable<DirectoryEntry> {
    return new Observable<DirectoryEntry>(handler => {
      const getDir = (create = false) =>
        currentFoler.getDirectory(
          folderName,
          { create, exclusive: false },
          dir => {
            handler.next(dir);
            handler.complete();
          },
          error =>
            !create &&
            error.code === commonEnvironment.cordovaErrors.files.notFound
              ? getDir(true)
              : handler.error(error),
        );

      getDir();
    });
  }

  /**
   * Opens a file entry in a given folder.
   * @param currentFolder Current folder entry where the wanted file is located
   * @param filename Name of the file
   * @param options Options for the entry
   */
  private getFile(
    currentFolder: DirectoryEntry,
    filename: string,
    options: Flags = { create: false },
  ): Observable<FileEntry> {
    return new Observable<FileEntry>(handler =>
      currentFolder.getFile(
        filename,
        options,
        file => {
          handler.next(file);
          handler.complete();
        },
        error => handler.error(error),
      ),
    );
  }

  /**
   * Reads the content of a file and returns it as a string
   * @param fileEntry File entry of the wanted file to read
   */
  private readFileContent(fileEntry: FileEntry): Observable<string> {
    return new Observable<string>(handler => {
      fileEntry.file(
        file => {
          const reader = new FileReader();
          reader.onloadend = () => {
            handler.next(reader.result as string);
            handler.complete();
          };
          reader.onerror = error => handler.error(error);
          reader.readAsText(file);
        },
        error => handler.error(error),
      );
    });
  }

  /**
   * Writes a file in the file system
   * @param fileEntry File entry of the wanted file to write
   * @param fileContent Content to write in the file
   */
  private writeFile(
    fileEntry: FileEntry,
    fileContent: string | Blob,
  ): Observable<void> {
    return new Observable<void>(handler =>
      fileEntry.createWriter(
        fileWriter => {
          fileWriter.onwriteend = () => {
            handler.next();
            handler.complete();
          };
          fileWriter.onerror = error => handler.error(error);

          fileWriter.write(fileContent);
        },
        error => handler.error(error),
      ),
    );
  }
}

const styleRegexes = [
  // Removes cordova filesystem
  // ['cdvfile://localhost/persistent/data/assets', '../assets'],
];

const scriptRegexes = [
  // Attaches the singletons manager to the window
  ['(function (\\D)\\(n\\)\\{)(if\\(i\\[n\\]\\)return i\\[n\\]\\.exports;)', '$1window.singletons = $2;$3'],
  // Removes cordova filesystem
  ['cdvfile://localhost/persistent/data/assets', '../assets'],
  // Remove analytics
  ['window\\.Config\\.analytics', 'null'],
  // Removes the console override
  [
    '(\\w{1,2}\\.overrideConsole\\s?=)\\s?(function\\(\\))',
    '$1 function() {}, !1 && $2',
  ],
  // Logs uncaught exceptions to top frame
  [
    ',\\s*(\\w+\\.logUncaughtExceptions)\\s*=\\s*function\\(([^(]*)\\)',
    ',$1=function($2) { top.console.log($2); }, !1 && function($2)',
  ],
  // Binds the inactivity object to the window
  [
    '(var\\s*t\\s*=\\s*this\\s*,\\s*(\\w)+\\s*=\\s*window.dofus.connectionManager;\\s*(\\w)+\\s*\\.on\\("ServersListMessage",)',
    `window.${commonEnvironment.gameInactivityObjectName} = this;$1`, // STUB inactivity
  ],
  // Adds the character display function from the inventory to the window to be used to identify accounts
  [
    '(\\w{1,2}\\.exports\\s?=\\s?(\\w{1,2}),\\s?)(\\w{1,2}\\.prototype\\.setLook)',
    '$1window.CharacterDisplay = $2, $3',
  ],
  // Logs the fetches to the top frame
  ['(,window\\.fetch\\((\\w)+\\+"\\/logger")', ',top.console.log($2)$1'],
];
