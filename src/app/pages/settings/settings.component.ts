import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { InstallationService } from 'src/app/core/installation/installation.service';
import { UserPreferencesQuery } from 'src/app/core/user-preferences/user-preferences.query';
import { UserPreferencesStore } from 'src/app/core/user-preferences/user-preferences.store';
import { InstallationQuery } from '../../core/installation/installation.query';

@Component({
  selector: 'mg-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  // Statuses reference for devs
  private readonly statuses = {
    0: 'inactive',
    1: 'installing',
    2: 'installed',
    3: 'error',
  };

  installStatus$ = combineLatest([
    this.installationQuery.gameUpdated$,
    this.installationQuery.fsBusy$,
    this.installationQuery.installError$,
  ]).pipe(
    map(([update, fs, error]) => {
      if (error) return 3;
      if (fs) return 1;
      if (update) return 2;
      return 0;
    }),
    tap(() => setTimeout(() => this.cdRef.detectChanges())),
  );

  fsBusy$ = this.installationQuery.fsBusy$;

  navAlign = new FormControl();
  accountsNavAlign = new FormControl();

  constructor(
    private cdRef: ChangeDetectorRef,
    private installationService: InstallationService,
    private installationQuery: InstallationQuery,
    private preferencesStore: UserPreferencesStore,
    private preferencesQuery: UserPreferencesQuery,
  ) {
    this.preferencesQuery.navAlign$
      .pipe(first())
      .subscribe((value) => this.navAlign.setValue(value));

    this.navAlign.valueChanges.subscribe((value) =>
      this.preferencesStore.setNavAlign(value),
    );

    this.preferencesQuery.accountsNavAlign$
      .pipe(first())
      .subscribe((value) => this.accountsNavAlign.setValue(value));

    this.accountsNavAlign.valueChanges.subscribe((value) =>
      this.preferencesStore.setAccountsNavAlign(value),
    );
  }

  updateGame() {
    this.installationService.updateGame().subscribe(() => {
      console.log('GAME UPDATED');
      this.cdRef.detectChanges();
    });
  }

  installAssets() {
    this.installationService.installAssets().subscribe(() => {
      console.log('ASSETS INSTALLED');
      this.cdRef.detectChanges();
    });
  }

  installBuild() {
    this.installationService.installBuild().subscribe(() => {
      console.log('BUILD INSTALLED');
      this.cdRef.detectChanges();
    });
  }

  copyError() {
    this.installationQuery.installError$.pipe(first()).subscribe((error) => {
      const el = document.createElement('textarea');
      let errorStr: string;
      try {
        error = JSON.stringify(error);
      } catch (jsonError) {
        errorStr = `Unable to copy the error 😥`;
      }
      el.value = errorStr;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
  }
}
