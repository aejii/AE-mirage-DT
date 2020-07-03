import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { forkJoin } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { UserInterfaceStore } from '../user-interface/user-interface.store';
import {
  UserPreferencesState,
  UserPreferencesStore,
} from './user-preferences.store';

@Injectable({ providedIn: 'root' })
export class UserPreferencesQuery extends Query<UserPreferencesState> {
  accounts$ = this.select('accounts');
  activeAccounts$ = this.select('accounts').pipe(
    map((accounts) => accounts.filter((account) => !!account.doesConnect)),
  );

  device$ = this.select('selectedDevice');
  devices$ = this.select('availableDevices').pipe(
    map((devices) =>
      [...devices].sort((a, b) => a.device.localeCompare(b.device)),
    ),
  );

  constructor(
    protected store: UserPreferencesStore,
    protected uiStore: UserInterfaceStore,
  ) {
    super(store);
  }

  connectAccounts() {
    this.activeAccounts$.pipe(first()).subscribe((accounts) => {
      const items = accounts.map((account) => ({
        account,
        instance: this.uiStore.addInstance(),
      }));

      const [leader, ...followers] = items.map((item) => item.instance);

      items.forEach(({ account, instance }, index) =>
        setTimeout(() => {
          instance.connect$.subscribe();
          instance.connect(account.username, account.password, false);
        }, index * 1000),
      );

      const followersConnect$ = followers.map((follower) =>
        follower.connect$.pipe(
          first(),
          map(() => follower),
        ),
      );

      forkJoin(followersConnect$).subscribe((instances) => {
        instances.forEach((instance, index) =>
          setTimeout(() => {
            instance.waitForPartyInvite();
            leader.sendPartyInvite(instance.characterName);
          }, index * 1000),
        );
      });
    });
  }
}
