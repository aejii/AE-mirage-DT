import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { InstallationQuery } from 'src/app/core/installation/installation.query';

export interface Account {
  username: string;
  password: string;
  lastImage?: string;
  connects?: boolean;
  isElk: boolean;
}

export interface AccountsState extends EntityState<Account> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'accounts', idKey: 'username' })
export class AccountsStore extends EntityStore<AccountsState> {
  constructor(private installationQuery: InstallationQuery) {
    super();
  }

  addAccount(username: string, password: string) {
    this.add({
      username,
      password,
      connects: true,
      isElk: this.installationQuery.getValue().isElk,
    });
  }
}
