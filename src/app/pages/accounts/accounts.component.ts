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
import { UserInterfaceQuery } from 'src/app/core/user-interface/user-interface.query';
import { UserInterfaceStore } from 'src/app/core/user-interface/user-interface.store';

@Component({
  selector: 'mg-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsComponent implements OnInit {
  accountForm = this.createForm();

  accounts$ = this.interfaceQuery.accounts$;
  activeAccounts$ = this.interfaceQuery.activeAccounts$;

  canConnect$ = combineLatest([
    this.activeAccounts$,
    this.installationQuery.gameUpdated$,
  ]).pipe(
    map(([accounts, update]) => !!accounts?.length && update),
    tap(() => setTimeout(() => this.cdRef.detectChanges())),
  );

  constructor(
    private fb: FormBuilder,
    private interfaceStore: UserInterfaceStore,
    private interfaceQuery: UserInterfaceQuery,
    private installationQuery: InstallationQuery,
    private router: Router,
    private cdRef: ChangeDetectorRef,
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
      this.interfaceStore.addAccount(this.accountForm.value);
      this.accountForm = this.createForm();
    }
  }

  updateConnect(account: AppAccount) {
    this.interfaceStore.updateAccountConnect(account);
  }

  deleteAccount(account: AppAccount) {
    this.interfaceStore.removeAccount(account);
  }

  connect() {
    this.interfaceQuery.connectAccounts();
    this.router.navigate(['/home']);
    this.interfaceStore.toggleMenu(false);
  }

  trackFn(item: AppAccount, index: number) {
    return item.username;
  }
}
