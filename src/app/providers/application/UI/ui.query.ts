import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { InstallationQuery } from 'src/app/core/installation/installation.query';
import { AccountsQuery } from '../../instances/accounts.query';
import { UIState, UIStore } from './ui.store';

@Injectable({ providedIn: 'root' })
export class UIQuery extends Query<UIState> {
  canPlay$ = this.installationQuery
    .select()
    .pipe(
      map(
        (state) =>
          state.isGameUpdated &&
          state.assetsReady &&
          state.buildReady &&
          !state.fileSystemBusy &&
          !state.installError,
      ),
    );

  canConnectAccounts$ = combineLatest([
    this.canPlay$,
    this.accountsQuery.selectAll(),
  ]).pipe(map(([canPlay, { length }]) => !!canPlay && !!length));

  showInstaller$ = this.installationQuery
    .select()
    .pipe(map((state) => state.fileSystemBusy));

  constructor(
    protected store: UIStore,
    protected installationQuery: InstallationQuery,
    protected accountsQuery: AccountsQuery,
  ) {
    super(store);
  }
}
