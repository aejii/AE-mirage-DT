import { Injectable } from '@angular/core';
import {
  ActiveState,
  EntityState,
  EntityStore,
  StoreConfig,
} from '@datorama/akita';
import { GameInstance } from '@model';

export interface InstancesState
  extends EntityState<GameInstance>,
    ActiveState {}

@Injectable({ providedIn: 'root' })
@StoreConfig({
  name: 'instances',
  idKey: 'ID',
  // Remove the window from the frozen state (so that the instance can bind the game frame to itself)
  deepFreezeFn: ({ window, ...frozenInstance }) => frozenInstance,
})
export class InstancesStore extends EntityStore<InstancesState> {
  constructor() {
    super();
  }
}
