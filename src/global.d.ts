declare var cordova: Cordova;

declare type ManifestName = 'manifest' | 'assetMap';

declare interface Manifest {
  files: {
    [filename: string]: FileItem;
  };
}

declare interface FileItem {
  filename: string;
  version: string;
}

declare interface AppAccount {
  username: string;
  password: string;
  doesConnect: boolean;
}