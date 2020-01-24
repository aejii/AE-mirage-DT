import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { map } from 'rxjs/operators';
import { InstallationState, InstallationStore } from './installation.store';

@Injectable({ providedIn: 'root' })
export class InstallationQuery extends Query<InstallationState> {
  fsBusy$ = this.select('fileSystemBusy');
  gameUpdated$ = this.select('isGameUpdated');
  installError$ = this.select('installError');

  constructor(protected store: InstallationStore) {
    super(store);
  }
}
