import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

type CardinalPosition = /* 'top' | 'bottom' |  */'left' | 'right';

export interface UserPreferencesState {
   navAlign: CardinalPosition;
   accountsNavAlign: CardinalPosition;
}

export function createInitialState(): UserPreferencesState {
  return {
    navAlign: 'left',
    accountsNavAlign: 'right',
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user-preferences' })
export class UserPreferencesStore extends Store<UserPreferencesState> {

  constructor() {
    super(createInitialState());
  }

  setNavAlign(navAlign: CardinalPosition) {
    this.update({ navAlign });
  }

  setAccountsNavAlign(accountsNavAlign: CardinalPosition) {
    this.update({ accountsNavAlign });
  }
}

