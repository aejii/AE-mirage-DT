import { Injectable } from '@angular/core';
import { arrayAdd, arrayRemove, Store, StoreConfig } from '@datorama/akita';
import { GameInstance } from '../instances-container/game-instance/game-instance.class';

export interface UserInterfaceState {
  instances: GameInstance[];
  activeInstance: GameInstance;
  showSettings: boolean;
  showAccounts: boolean;
}

export function createInitialState(): UserInterfaceState {
  return {
    instances: [],
    activeInstance: undefined,
    showAccounts: false,
    showSettings: false,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user-interface', deepFreezeFn: (state) => state })
export class UserInterfaceStore extends Store<UserInterfaceState> {
  constructor() {
    super(createInitialState());
  }

  toggleSettings(forceValue?: boolean) {
    this.update((state) => ({
      showSettings: forceValue ?? !state.showSettings,
    }));
  }

  toggleAccounts(forceValue?: boolean) {
    this.update((state) => ({
      showAccounts: forceValue ?? !state.showAccounts,
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

    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
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
