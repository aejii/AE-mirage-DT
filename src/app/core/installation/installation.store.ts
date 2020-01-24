import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface InstallationState {
  fileSystemBusy: boolean;
  isGameUpdated: boolean;
  installError: string;
}

export function createInitialState(): InstallationState {
  return {
    fileSystemBusy: false,
    isGameUpdated: false,
    installError: undefined,
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
    this.update({ isGameUpdated });
  }
}
