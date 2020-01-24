import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { forkJoin } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { GameInstance } from '../model/game/instance.class';
import { UserInterfaceState, UserInterfaceStore } from './user-interface.store';

@Injectable({ providedIn: 'root' })
export class UserInterfaceQuery extends Query<UserInterfaceState> {
  accounts$ = this.select('accounts');
  activeAccounts$ = this.select('accounts').pipe(
    map((accounts) => accounts.filter((account) => !!account.doesConnect)),
  );

  instances$ = this.select('instances');
  activeInstance$ = this.select('activeInstance');

  isMenuVisible$ = this.select('isMenuVisible');

  constructor(protected store: UserInterfaceStore) {
    super(store);
  }

  indexOfInstance(instance: GameInstance) {
    return this.getValue().instances.indexOf(instance);
  }

  connectAccounts() {
    this.activeAccounts$.pipe(first()).subscribe((accounts) => {
      const items = accounts.map((account) => ({
        account,
        instance: this.store.addInstance(),
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
