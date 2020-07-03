import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { InstallationQuery } from 'src/app/core/installation/installation.query';
import { UserInterfaceStore } from '../user-interface/user-interface.store';
import { UserPreferencesQuery } from '../user-preferences/user-preferences.query';
import { UserPreferencesStore } from '../user-preferences/user-preferences.store';

@Component({
  selector: 'mg-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsComponent implements OnInit {
  accountForm = this.createForm();

  accounts$ = this.query.accounts$;
  activeAccounts$ = this.query.activeAccounts$;

  canConnect$ = combineLatest([
    this.activeAccounts$,
    this.installationQuery.gameUpdated$,
  ]).pipe(
    map(([accounts, update]) => !!accounts?.length && update),
    tap(() => setTimeout(() => this.cdRef.detectChanges())),
  );

  constructor(
    private fb: FormBuilder,
    private store: UserPreferencesStore,
    private query: UserPreferencesQuery,
    private installationQuery: InstallationQuery,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private uiStore: UserInterfaceStore,
  ) {}

  createForm(): FormGroup {
    const form = this.fb.group({
      username: '',
      password: '',
      doesConnect: true,
    } as AppAccount);
    form.get('username').setValidators([Validators.required]);
    form.get('password').setValidators([Validators.required]);
    return form;
  }

  ngOnInit(): void {}

  addAccount() {
    if (this.accountForm.valid) {
      this.store.addAccount(this.accountForm.value);
      this.accountForm = this.createForm();
    }
  }

  updateConnect(account: AppAccount) {
    this.store.updateAccountConnect(account);
  }

  deleteAccount(account: AppAccount) {
    this.store.removeAccount(account);
  }

  connect() {
    this.query.connectAccounts();
    this.uiStore.toggleAccounts(false);
  }

  trackFn(item: AppAccount, index: number) {
    return item.username;
  }
}
