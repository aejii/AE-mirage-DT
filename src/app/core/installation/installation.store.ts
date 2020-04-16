import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface InstallationState {
  fileSystemBusy: boolean;
  isGameUpdated: boolean;
  assetsReady: boolean;
  buildReady: boolean;
  installError: string;
}

export function createInitialState(): InstallationState {
  return {
    fileSystemBusy: false,
    isGameUpdated: false,
    installError: undefined,
    assetsReady: false,
    buildReady: false,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'installation' })
export class InstallationStore extends Store<InstallationState> {
  constructor() {
    super(createInitialState());
    this.update({
      isGameUpdated: false,
      fileSystemBusy: false,
      installError: undefined,
    });
  }

  setInstallError(installError: any) {
    this.update({ installError });
  }

  setFileSystemBusiness(fileSystemBusy: boolean) {
    this.update({ fileSystemBusy });
  }

  setGameUpdatedStatus(isGameUpdated: boolean) {
    this.update({ isGameUpdated, assetsReady: true, buildReady: true });
  }

  setAssetsReady(assetsReady: boolean) {
    this.update({
      assetsReady,
      isGameUpdated: assetsReady && this.getValue().buildReady,
    });
  }

  setBuildReady(buildReady: boolean) {
    this.update({
      buildReady,
      isGameUpdated: buildReady && this.getValue().assetsReady,
    });
  }
}
