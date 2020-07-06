import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface UIState {
  showAccounts: boolean;
  showSettings: boolean;
  showInstaller: boolean;
  showCreateAccount: boolean;
}

export function createInitialState(): UIState {
  return {
    showAccounts: false,
    showSettings: false,
    showInstaller: false,
    showCreateAccount: false,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'UI' })
export class UIStore extends Store<UIState> {
  constructor() {
    super(createInitialState());
  }
}
