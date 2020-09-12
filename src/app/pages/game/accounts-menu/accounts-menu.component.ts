import { CdkDragDrop } from '@angular/cdk/drag-drop';
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
import { GameInstance } from '@model';
import { InstancesService, UIService } from '@providers';
import { map } from 'rxjs/operators';

@Component({
  selector: 'mg-accounts-menu',
  templateUrl: './accounts-menu.component.html',
  styleUrls: ['./accounts-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsMenuComponent implements OnInit {
  private currentInstancesOrder: GameInstance[] = [];

  instances$ = this.service.instances$.pipe(
    map((frozenInstances) => {
      const instances = [...frozenInstances];
      this.currentInstancesOrder = instances;
      return instances;
    }),
  );
  active$ = this.service.activeInstance$;

  @ViewChildren('accountsRef') accounts: QueryList<ElementRef<HTMLDivElement>>;

  constructor(
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef,
    private service: InstancesService,
    public UI: UIService,
  ) {}

  ngOnInit(): void {}

  sortInstances(event: CdkDragDrop<GameInstance[]>) {
    this.currentInstancesOrder.splice(
      event.currentIndex,
      0,
      this.currentInstancesOrder.splice(event.previousIndex, 1)[0],
    );
    this.cdRef.detectChanges();
  }

  addGame() {
    this.service.addInstance();
  }

  setActive(instance: GameInstance) {
    this.service.setActiveInstance(instance);
  }

  removeInstance(instance: GameInstance) {
    this.service.removeInstance(instance);
  }

  removeAllInstances() {
    this.service.removeAllInstances();
  }

  setAccountImage(instance: GameInstance, canvas: HTMLDivElement) {
    const accounts = this.accounts.toArray();
    const account = accounts[this.currentInstancesOrder.indexOf(instance)];
    const accountEl = account.nativeElement;

    if (!accountEl) return;

    accountEl.innerHTML = '';
    this.renderer.appendChild(accountEl, canvas);
  }

  setAccountNumber(instance: GameInstance) {
    this.cdRef.detectChanges();
    const span = document.createElement('span');
    const index = this.currentInstancesOrder.indexOf(instance);
    const accounts = this.accounts.toArray();
    const account = accounts[index];
    const accountEl = account?.nativeElement;

    if (!accountEl) return;

    accountEl.innerHTML = '';
    span.innerText = `${index + 1 || '?'}`;
    this.renderer.appendChild(accountEl, span);
  }
}
