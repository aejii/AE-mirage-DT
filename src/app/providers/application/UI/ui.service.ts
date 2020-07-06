import { Injectable } from '@angular/core';
import { UIQuery } from './ui.query';
import { UIStore } from './ui.store';

@Injectable({
  providedIn: 'root',
})
export class UIService {
  showSettings$ = this.query.select('showSettings');
  showAccounts$ = this.query.select('showAccounts');
  showInstaller$ = this.query.showInstaller$;
  showCreateAccount$ = this.query.select('showCreateAccount');

  canPlay$ = this.query.canPlay$;
  canConnectAccounts$ = this.query.canConnectAccounts$;

  constructor(private store: UIStore, private query: UIQuery) {}

  toggleSettings(forceValue?: boolean) {
    const showSettings = forceValue ?? !this.query.getValue().showSettings;
    const showAccounts = showSettings
      ? false
      : this.query.getValue().showAccounts;
    const showCreateAccount = false;

    this.store.update({
      showAccounts,
      showSettings,
      showCreateAccount,
    });
  }

  toggleAccounts(forceValue?: boolean) {
    const showAccounts = forceValue ?? !this.query.getValue().showAccounts;
    const showSettings = showAccounts
      ? false
      : this.query.getValue().showSettings;
    const showCreateAccount = false;

    this.store.update({
      showAccounts,
      showSettings,
      showCreateAccount,
    });
  }

  toggleInstaller(forceValue?: boolean) {
    this.store.update((state) => ({
      showInstaller: forceValue ?? !state.showInstaller,
    }));
  }

  toggleCreateAccount(forceValue?: boolean) {
    this.store.update((state) => ({
      showCreateAccount: forceValue ?? !state.showCreateAccount,
    }));
  }
}
