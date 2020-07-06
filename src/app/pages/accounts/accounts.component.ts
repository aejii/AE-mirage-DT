import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { InstancesService, UIService } from '@providers';

@Component({
  selector: 'mg-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsComponent implements OnInit {
  accounts$ = this.service.accounts$;

  constructor(public service: InstancesService, public UI: UIService) {}

  ngOnInit(): void {}

  connectAccounts() {
    this.service.connectAccounts();
    this.UI.toggleAccounts(false);
  }
}
