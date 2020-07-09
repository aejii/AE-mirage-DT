import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InstancesService, UIService } from '@providers';

@Component({
  selector: 'mg-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountComponent implements AfterViewInit {
  accountForm: FormGroup;

  @ViewChild('usernameInput') usernameRef: ElementRef<HTMLInputElement>;

  constructor(
    private builder: FormBuilder,
    public service: InstancesService,
    public UI: UIService,
  ) {
    this.accountForm = this.builder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngAfterViewInit() {
    this.usernameRef?.nativeElement?.focus();
  }

  addAccount() {
    if (!this.accountForm.valid) return;
    this.service.addAccount({
      ...this.accountForm.value,
    });
    this.accountForm.reset();
    this.UI.toggleCreateAccount(false);
  }
}
