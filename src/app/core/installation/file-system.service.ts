import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { commonEnvironment } from 'src/environments/environment.common';
import { mirageoldFileSystemImplementation } from './file-system.implementation';

@Injectable({
  providedIn: 'root',
})
export class FileSystemService implements mirageoldFileSystemImplementation {
  gamePath$ = of('');

  public readonly scriptFilename = commonEnvironment.scriptFilename;
  public readonly styleFilename = commonEnvironment.styleFilename;

  constructor() {}

  getLocalManifest(): Observable<Manifest> {
    return of<Manifest>({ files: {} });
  }

  getLocalAssetMap(): Observable<Manifest> {
    return of<Manifest>({ files: {} });
  }

  getRemoteManifest(): Observable<Manifest> {
    return of<Manifest>({ files: {} });
  }

  getRemoteAssetMap(): Observable<Manifest> {
    return of<Manifest>({ files: {} });
  }

  updateGameFile(filename: string): Observable<void> {
    return of();
  }

  writeManifest(fileContent: Manifest): Observable<void> {
    return of();
  }
  writeAssetMap(fileContent: Manifest): Observable<void> {
    return of();
  }

  writeAssetFile(filename: string, fileContent: Blob): Observable<void> {
    return of();
  }

  editScript(): Observable<void> {
    return of();
  }

  editStyle(): Observable<void> {
    return of();
  }

  installMocks(): Observable<void> {
    return of();
  }
}
