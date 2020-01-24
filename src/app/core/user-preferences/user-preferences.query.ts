import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import {
  UserPreferencesState,
  UserPreferencesStore,
} from './user-preferences.store';

@Injectable({ providedIn: 'root' })
export class UserPreferencesQuery extends Query<UserPreferencesState> {
  navAlign$ = this.select('navAlign');
  accountsNavAlign$ = this.select('accountsNavAlign');

  constructor(protected store: UserPreferencesStore) {
    super(store);
  }
}
