import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { UserAgentStore, UserAgentState } from './user-agent.store';

@Injectable({ providedIn: 'root' })
export class UserAgentQuery extends QueryEntity<UserAgentState> {

  constructor(protected store: UserAgentStore) {
    super(store);
  }

}
