import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Account, InstancesService, UIService } from '@providers';

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

  sortAccounts(event: CdkDragDrop<Account[]>) {
    const orderedAccounts = [...this.service.accounts];
    orderedAccounts.splice(
      event.currentIndex,
      0,
      orderedAccounts.splice(event.previousIndex, 1)[0],
    );
    this.service.setNewAccountsOrder(orderedAccounts);
  }
}
