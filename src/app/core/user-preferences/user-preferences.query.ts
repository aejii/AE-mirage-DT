import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { map } from 'rxjs/operators';
import {
  UserPreferencesState,
  UserPreferencesStore,
} from './user-preferences.store';

@Injectable({ providedIn: 'root' })
export class UserPreferencesQuery extends Query<UserPreferencesState> {
  navAlign$ = this.select('navAlign');
  accountsNavAlign$ = this.select('accountsNavAlign');

  device$ = this.select('selectedDevice');
  devices$ = this.select('availableDevices').pipe(
    map((devices) => [...devices].sort((a, b) => a.device.localeCompare(b.device))),
  );

  constructor(protected store: UserPreferencesStore) {
    super(store);
  }
}
