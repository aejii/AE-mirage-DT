import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GameInstance } from 'src/app/core/instances-container/game-instance/game-instance.class';
import { UserInterfaceQuery } from 'src/app/core/user-interface/user-interface.query';
import { UserInterfaceStore } from 'src/app/core/user-interface/user-interface.store';

@Injectable({
  providedIn: 'root',
})
export class InstancesContainerService {
  instances$ = this.userInterfaceQuery.instances$;
  active$ = this.userInterfaceQuery.activeInstance$;

  private _connectAccounts = new Subject<AppAccount[]>();
  public connectAccounts$ = this._connectAccounts.asObservable();

  constructor(
    private userInterfaceStore: UserInterfaceStore,
    private userInterfaceQuery: UserInterfaceQuery,
  ) {}

  connectAccounts(accounts: AppAccount[]) {
    this._connectAccounts.next(accounts);
  }

  indexOf(instance: GameInstance) {
    return this.userInterfaceQuery.indexOfInstance(instance);
  }

  addGame(): GameInstance {
    return this.userInterfaceStore.addInstance();
  }

  setActive(instance: GameInstance) {
    this.userInterfaceStore.setActiveInstance(instance);
  }

  removeInstance(instance: GameInstance) {
    this.userInterfaceStore.removeInstance(instance);
  }

  removeAll() {
    this.userInterfaceStore.removeAllInstances();
  }
}
