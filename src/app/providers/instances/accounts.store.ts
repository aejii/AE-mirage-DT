import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface Account {
  username: string;
  password: string;
  lastImage?: string;
  connects?: boolean;
}

export interface AccountsState extends EntityState<Account> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'accounts', idKey: 'username' })
export class AccountsStore extends EntityStore<AccountsState> {
  constructor() {
    super();
  }
}
