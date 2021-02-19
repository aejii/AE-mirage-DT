import { Observable } from 'rxjs';

export interface mirageoldFileSystemImplementation {
  /** Path to the game files */
  gamePath$: Observable<string>;

  scriptFilename: string;
  styleFilename: string;

  /** Gets file system manifest */
  getLocalManifest(): Observable<Manifest>;
  /** Gets file system asset map */
  getLocalAssetMap(): Observable<Manifest>;
  /** Gets HTTP manifest */
  getRemoteManifest(): Observable<Manifest>;
  /** Gets HTTP asset map */
  getRemoteAssetMap(): Observable<Manifest>;

  /** Writes manifest to file system */
  writeManifest(fileContent: Manifest): Observable<void>;
  /** Writes asset map to file system */
  writeAssetMap(fileContent: Manifest): Observable<void>;

  /** Downloads an HTTP file and writes it to the file system */
  updateGameFile(filename: string): Observable<void>;

  /** Edits the script file to comply with the file system */
  editScript(): Observable<void>;
  /** Edits the style file to comply with the file system */
  editStyle(): Observable<void>;

  /** Installs the mock files to the game folder */
  installMocks(): Observable<any>;
}
