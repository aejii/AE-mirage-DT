import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  accounts$ = this.query.accounts$;
  activeAccounts$ = this.query.activeAccounts$;

  constructor(
    private fb: FormBuilder,
    private store: UserInterfaceStore,
    private query: UserInterfaceQuery,
    private router: Router,
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
    this.router.navigate(['/home']);
    this.store.toggleMenu(false);
  }

  trackFn(item: AppAccount, index: number) {
    return item.username;
  }
}
