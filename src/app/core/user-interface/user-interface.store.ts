import { Injectable } from '@angular/core';
import {
  arrayAdd,
  arrayRemove,
  arrayUpdate,
  Store,
  StoreConfig,
} from '@datorama/akita';
import { GameInstance } from '../model/game/instance.class';

export interface UserInterfaceState {
  accounts: AppAccount[];
  instances: GameInstance[];
  activeInstance: GameInstance;
  isMenuVisible: boolean;
}

export function createInitialState(): UserInterfaceState {
  return {
    accounts: [],
    instances: [],
    activeInstance: undefined,
    isMenuVisible: true,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user-interface', deepFreezeFn: (state) => state })
export class UserInterfaceStore extends Store<UserInterfaceState> {
  constructor() {
    super(createInitialState());
  }

  toggleMenu(forceValue?: boolean) {
    this.update({
      isMenuVisible: forceValue ?? !this.getValue().isMenuVisible,
    });
  }

  addAccount(account: AppAccount) {
    this.update((state) => ({ accounts: arrayAdd(state.accounts, account) }));
  }

  updateAccountConnect(account: AppAccount) {
    this.update((state) => ({
      accounts: arrayUpdate(
        state.accounts,
        (acc) => acc.username === account.username,
        { doesConnect: !account.doesConnect },
      ),
    }));
  }

  removeAccount(account: AppAccount) {
    this.update((state) => ({
      accounts: arrayRemove(
        state.accounts,
        (acc) => acc.username === account.username,
      ),
    }));
  }

  addInstance(): GameInstance {
    const instance = new GameInstance();
    this.update((state) => ({
      instances: arrayAdd(state.instances, instance),
    }));
    this.setActiveInstance(instance);
    return instance;
  }

  setActiveInstance(instance?: GameInstance) {
    if (instance) this.update({ activeInstance: instance });
    else this.update({ activeInstance: this.getValue().instances[0] });
  }

  removeInstance(instance: GameInstance) {
    this.update((state) => ({
      instances: arrayRemove(state.instances, (i) => i.ID === instance.ID),
    }));
  }

  removeAllInstances() {
    this.update({ instances: [] });
  }
}
