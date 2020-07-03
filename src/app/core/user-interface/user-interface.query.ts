import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { GameInstance } from '../instances-container/game-instance/game-instance.class';
import { UserInterfaceState, UserInterfaceStore } from './user-interface.store';

@Injectable({ providedIn: 'root' })
export class UserInterfaceQuery extends Query<UserInterfaceState> {
  instances$ = this.select('instances');
  activeInstance$ = this.select('activeInstance');

  showSettings$ = this.select('showSettings');
  showAccounts$ = this.select('showAccounts');

  constructor(protected store: UserInterfaceStore) {
    super(store);
  }

  indexOfInstance(instance: GameInstance) {
    return this.getValue().instances.indexOf(instance);
  }
}
