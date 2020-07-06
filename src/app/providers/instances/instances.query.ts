import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { InstancesStore, InstancesState } from './instances.store';

@Injectable({ providedIn: 'root' })
export class InstancesQuery extends QueryEntity<InstancesState> {

  constructor(protected store: InstancesStore) {
    super(store);
  }

}
