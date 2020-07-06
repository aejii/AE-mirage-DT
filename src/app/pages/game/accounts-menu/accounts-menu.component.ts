import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { InstancesService, UIService } from '@providers';
import { GameInstance } from '@model';

@Component({
  selector: 'mg-accounts-menu',
  templateUrl: './accounts-menu.component.html',
  styleUrls: ['./accounts-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsMenuComponent implements OnInit {
  instances$ = this.instancesService.instances$;
  active$ = this.instancesService.activeInstance$;

  @ViewChildren('accountsRef') accounts: QueryList<ElementRef<HTMLDivElement>>;

  constructor(
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef,
    private instancesService: InstancesService,
    public UI: UIService,
  ) {}

  ngOnInit(): void {}

  addGame() {
    this.instancesService.addInstance();
  }

  setActive(instance: GameInstance) {
    this.instancesService.setActiveInstance(instance);
  }

  removeInstance(instance: GameInstance) {
    this.instancesService.removeInstance(instance);
  }

  removeAllInstances() {
    this.instancesService.removeAllInstances();
  }

  setAccountImage(instance: GameInstance, canvas: HTMLDivElement) {
    const accounts = this.accounts.toArray();
    const account = accounts[this.instancesService.indexOfInstance(instance)];
    const accountEl = account.nativeElement;

    if (!accountEl) return;

    accountEl.innerHTML = '';
    this.renderer.appendChild(accountEl, canvas);
  }

  setAccountNumber(instance: GameInstance) {
    this.cdRef.detectChanges();
    const span = document.createElement('span');
    const index = this.instancesService.indexOfInstance(instance);
    const accounts = this.accounts.toArray();
    const account = accounts[index];
    const accountEl = account?.nativeElement;

    if (!accountEl) return;

    accountEl.innerHTML = '';
    span.innerText = `${index + 1 || '?'}`;
    this.renderer.appendChild(accountEl, span);
  }
}
