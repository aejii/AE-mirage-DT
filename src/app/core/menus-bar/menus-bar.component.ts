import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { combineLatest, interval } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { InstallationQuery } from '../installation/installation.query';
import { GameInstance } from '../instances-container/game-instance/game-instance.class';
import { UserInterfaceQuery } from '../user-interface/user-interface.query';
import { UserInterfaceStore } from '../user-interface/user-interface.store';

@Component({
  selector: 'mg-menus-bar',
  templateUrl: './menus-bar.component.html',
  styleUrls: ['./menus-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsBarComponent implements OnInit {
  instances$ = this.interfaceQuery.instances$;
  active$ = this.interfaceQuery.activeInstance$;

  @ViewChildren('accounts') accounts: QueryList<ElementRef<HTMLDivElement>>;

  listenedInstancesId: string[] = [];

  isTopMenuExpanded = false;
  isAccountsMenuExpanded = false;

  get pageWidth() {
    return document.body.offsetWidth;
  }

  gameReady$ = combineLatest([
    this.installationQuery.fsBusy$,
    this.installationQuery.gameUpdated$,
  ]).pipe(
    map(([fs, update]) => !fs && !!update),
    tap(() => setTimeout(() => this.cdRef.detectChanges())),
  );

  updateSource$ = interval(5000);

  constructor(
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef,
    private interfaceStore: UserInterfaceStore,
    private interfaceQuery: UserInterfaceQuery,
    private installationQuery: InstallationQuery,
  ) {}

  ngOnInit() {
    // Mute all instances except first one
    this.active$
      .pipe(
        filter((instance) => !!instance),
        switchMap((instance) => {
          instance.muteAllSounds(false);
          return this.instances$.pipe(
            map((instances) => instances.filter((i) => i !== instance)),
          );
        }),
      )
      .subscribe((instances) =>
        instances.forEach((instance) => instance.muteAllSounds(true)),
      );

    this.instances$.subscribe((instances) => {
      const instancesToListen = instances.filter(
        (instance) => !this.listenedInstancesId.includes(instance.ID),
      );

      instancesToListen.forEach((instance) => {
        instance.characterImage$.subscribe((canvas) =>
          this.setAccountImage(instance, canvas),
        );

        instance.disconnect$.subscribe(() => this.setAccountNumber(instance));

        this.listenedInstancesId.push(instance.ID);
      });
    });

    this.updateSource$
      .pipe(switchMap(() => this.instances$))
      .subscribe((instances) => {
        const dc = instances.reduce((acc, i) => acc + i.dropChance, 0);
        const lvl = instances.reduce((acc, i) => acc + i.level, 0);

        instances.forEach((instance) => instance.addPartyInformations(dc, lvl));
      });
  }

  addGame() {
    this.interfaceStore.addInstance();
  }

  setActive(instance: GameInstance) {
    this.interfaceStore.setActiveInstance(instance);
  }

  removeInstance(instance: GameInstance) {
    this.interfaceStore.removeInstance(instance);
    this.interfaceStore.setActiveInstance();
  }

  removeAllInstances() {
    this.interfaceStore.removeAllInstances();
  }

  setAccountImage(instance: GameInstance, canvas: HTMLCanvasElement) {
    const accounts = this.accounts.toArray();
    const account = accounts[this.interfaceQuery.indexOfInstance(instance)];
    const accountEl = account.nativeElement;

    if (!accountEl) return;

    accountEl.innerHTML = '';
    this.renderer.appendChild(accountEl, canvas);
  }

  setAccountNumber(instance: GameInstance) {
    const span = document.createElement('span');
    const index = this.interfaceQuery.indexOfInstance(instance);
    const accounts = this.accounts.toArray();
    const account = accounts[index];
    const accountEl = account?.nativeElement;

    if (!accountEl) return;

    accountEl.innerHTML = '';
    span.innerText = `${index + 1 || '?'}`;
    this.renderer.appendChild(accountEl, span);
  }
}
