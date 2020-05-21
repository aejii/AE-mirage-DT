import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
} from '@angular/core';
import { combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { InstallationQuery } from 'src/app/core/installation/installation.query';

@Component({
  selector: 'mg-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  // Statuses reference for devs
  private readonly statuses = {
    0: 'inactive',
    1: 'installing',
    2: 'installed',
    3: 'error',
  };

  @HostBinding('style.display') display = 'flex';

  installStatus$ = combineLatest([
    this.query.gameUpdated$,
    this.query.fsBusy$,
    this.query.installError$,
  ]).pipe(
    map(([update, fs, error]) => {
      if (error) return 3;
      if (fs) return 1;
      if (update) return 2;
      return 0;
    }),
    tap(() => setTimeout(() => this.cdRef.detectChanges())),
  );

  constructor(
    private query: InstallationQuery,
    private cdRef: ChangeDetectorRef,
  ) {}
}
