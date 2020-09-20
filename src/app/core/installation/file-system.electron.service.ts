import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlatformPath } from 'path';
import { concat, forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { commonEnvironment } from '../../../environments/environment.common';
import { MirageFileSystemImplementation } from './file-system.implementation';
import { InstallationQuery } from './installation.query';

// Workarounds the NG limitation of not using Node modules
const nodePath: PlatformPath = window.require('path');
const nodeFs: typeof import('fs') = window.require('fs');

const appDataPath =
  process.env.APPDATA ||
  (process.platform === 'darwin'
    ? process.env.HOME + '/Library/Preferences'
    : process.env.HOME + '/.local/share');

@Injectable({
  providedIn: 'root',
})
export class FileSystemService implements MirageFileSystemImplementation {
  private appDataFolderName = 'Mirage';
  private gamePath = nodePath.join(appDataPath, this.appDataFolderName);
  private assetsDir = nodePath.join(__dirname, 'assets');

  private get remoteProxy() {
    return this.installationQuery.getValue().isElk
      ? commonEnvironment.elkProxy
      : commonEnvironment.dofusTouchProxy;
  }

  gamePath$ = of(nodePath.join(this.gamePath, 'index.html'));
  scriptFilename = commonEnvironment.scriptFilename;
  styleFilename = commonEnvironment.styleFilename;

  constructor(
    private http: HttpClient,
    private installationQuery: InstallationQuery,
  ) {
    nodeFs.stat(this.gamePath, (err, stats) => {
      if (!stats?.isDirectory())
        nodeFs.mkdir(this.appDataFolderName, (error) => {
          if (error) throw error;
          console.log('Root directory created in user AppData folder');
        });
    });
  }

  getLocalManifest(): Observable<Manifest> {
    return this._readFile(commonEnvironment.manifestFilename).pipe(
      catchError((err: NodeJS.ErrnoException) => {
        if (err.code === 'ENOENT')
          return of(JSON.stringify({ files: {} }, null, 2));
        return throwError(err);
      }),
      map((content) => JSON.parse(content)),
    );
  }

  getLocalAssetMap(): Observable<Manifest> {
    return this._readFile(commonEnvironment.assetMapFilename).pipe(
      catchError((err: NodeJS.ErrnoException) => {
        if (err.code === 'ENOENT')
          return of(JSON.stringify({ files: {} }, null, 2));
        return throwError(err);
      }),
      map((content) => JSON.parse(content)),
    );
  }
  getRemoteManifest() {
    return this.http.get<Manifest>(
      this.remoteProxy + commonEnvironment.manifestFilename,
    );
  }

  getRemoteAssetMap() {
    return this.http.get<Manifest>(
      this.remoteProxy + commonEnvironment.assetMapFilename,
    );
  }
  writeManifest(fileContent: Manifest): Observable<void> {
    return this._writeFile(
      commonEnvironment.manifestFilename,
      JSON.stringify(fileContent, null, 4),
    );
  }
  writeAssetMap(fileContent: Manifest): Observable<void> {
    return this._writeFile(
      commonEnvironment.assetMapFilename,
      JSON.stringify(fileContent, null, 4),
    );
  }

  updateGameFile(filename: string): Observable<void> {
    const path = filename.split('/');
    const name = path.pop();
    return this._createDir(path.join('/')).pipe(
      switchMap(() => this._getRemoteFileBlob(filename)),
      switchMap((blob) => this._writeBlobFile(filename, blob)),
    );
  }

  editScript(): Observable<void> {
    return this.applyRegexes(commonEnvironment.scriptFilename, scriptRegexes);
  }

  editStyle(): Observable<void> {
    return this.applyRegexes(commonEnvironment.styleFilename, styleRegexes);
  }

  installMocks(): Observable<any> {
    const scriptContent$ = this._readFile(
      commonEnvironment.scriptMockFile,
      this.assetsDir,
    ).pipe(
      switchMap((content) =>
        this.getAppVersion().pipe(
          map((version) =>
            content.replace(commonEnvironment.appVersionPlaceholder, version),
          ),
        ),
      ),
      switchMap((content) =>
        this.getBuildVersion().pipe(
          map((version) =>
            content.replace(commonEnvironment.buildVersionPlaceholder, version),
          ),
        ),
      ),
    );

    const indexContent$ = this._readFile(
      commonEnvironment.indexMockFile,
      this.assetsDir,
    );

    const styleContent$ = this._readFile(
      commonEnvironment.styleMockFile,
      this.assetsDir,
    );

    const operations$ = [
      { filename: commonEnvironment.scriptMockFile, content$: scriptContent$ },
      { filename: commonEnvironment.indexMockFile, content$: indexContent$ },
      { filename: commonEnvironment.styleMockFile, content$: styleContent$ },
    ].map((item) =>
      item.content$.pipe(
        switchMap((content) => this._writeFile(item.filename, content)),
      ),
    );

    return forkJoin([concat(...operations$)]);
  }

  private getAppVersion(): Observable<string> {
    return this.http
      .get<any>(commonEnvironment.iTunesManifestUrl)
      .pipe(map((iTunesManifest) => iTunesManifest.results[0].version));
  }

  private getBuildVersion() {
    return this._readFile(commonEnvironment.scriptFilename).pipe(
      map((content) => commonEnvironment.scriptBuildRegex.exec(content)[1]),
    );
  }

  private _createDir(path: string, root = this.gamePath): Observable<void> {
    const fullPath = nodePath.join(root, path);
    return new Observable<void>((handler) => {
      nodeFs.stat(fullPath, (error, stats) => {
        if (stats?.isDirectory()) {
          handler.next();
          handler.complete();
        } else
          nodeFs.mkdir(fullPath, { recursive: true }, (err) => {
            if (err) return handler.error(err);
            handler.next();
            handler.complete();
          });
      });
    });
  }

  private _readFile(path: string, root = this.gamePath): Observable<string> {
    const fullPath = nodePath.join(root, path);
    return new Observable<string>((handler) => {
      nodeFs.readFile(fullPath, (error, buffer) => {
        if (error) return handler.error(error);
        else handler.next(buffer.toString());
        handler.complete();
      });
    });
  }

  private _writeFile(
    path: string,
    content: string,
    root = this.gamePath,
  ): Observable<void> {
    const fullPath = nodePath.join(root, path);
    return new Observable<void>((handler) => {
      nodeFs.writeFile(fullPath, content, (error) => {
        if (error) return handler.error(error);
        handler.next();
        handler.complete();
      });
    });
  }

  private _writeBlobFile(
    path: string,
    content: Blob,
    root = this.gamePath,
  ): Observable<void> {
    const fullPath = nodePath.join(root, path);
    return new Observable<void>((handler) => {
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = Buffer.from(reader.result);
        nodeFs.writeFile(fullPath, buffer, (error) => {
          if (error) return handler.error(error);
          handler.next();
          handler.complete();
        });
      };
      reader.readAsArrayBuffer(content);
    });
  }

  private _getRemoteFileBlob(filename: string): Observable<Blob> {
    return this.http.get(this.remoteProxy + filename, {
      responseType: 'blob',
    });
  }

  // Opens the given filepath and writes the regexes in it, then saves it
  private applyRegexes(filePath: string, regexes: string[][]) {
    return this._readFile(filePath).pipe(
      map((content) =>
        regexes.reduce(
          (newContent, regex) =>
            newContent.replace(new RegExp(regex[0], 'g'), regex[1]),
          content,
        ),
      ),
      switchMap((content) => this._writeFile(filePath, content)),
    );
  }
}

const styleRegexes = [
  // Removes cordova filesystem
  ['cdvfile://localhost/persistent/data/assets', '../assets'],
];

const scriptRegexes = [
  // Removes cordova filesystem
  ['cdvfile://localhost/persistent/data/assets', '../assets'],
  // Attaches the singletons manager to the window
  [
    '(function (\\D)\\(n\\)\\{)(if\\(i\\[n\\]\\)return i\\[n\\]\\.exports;)',
    '$1window.singletons = $2;$3',
  ],
];
