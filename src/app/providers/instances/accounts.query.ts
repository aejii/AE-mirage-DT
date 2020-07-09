import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { InstallationQuery } from 'src/app/core/installation/installation.query';
import { AccountsState, AccountsStore } from './accounts.store';

@Injectable({ providedIn: 'root' })
export class AccountsQuery extends QueryEntity<AccountsState> {
  accounts$ = combineLatest([
    this.selectAll(),
    this.installationQuery.select('isElk'),
  ]).pipe(
    map(
      ([accounts, isElk]) =>
        accounts.filter((account) => !!account.isElk === !!isElk), // prevent undefined states
    ),
  );

  get accountsToConnect() {
    return this.getAll().filter(
      (account) =>
        account.connects &&
        !!account.isElk === !!this.installationQuery.getValue().isElk,
    );
  }

  constructor(
    protected store: AccountsStore,
    private installationQuery: InstallationQuery,
  ) {
    super(store);
  }
}
