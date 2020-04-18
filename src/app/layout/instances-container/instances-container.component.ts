import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { combineLatest, interval } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { InstallationQuery } from 'src/app/core/installation/installation.query';
import { GameInstance } from 'src/app/core/model/game/instance.class';
import { UserInterfaceQuery } from 'src/app/core/user-interface/user-interface.query';
import { UserInterfaceStore } from 'src/app/core/user-interface/user-interface.store';
import { UserPreferencesQuery } from 'src/app/core/user-preferences/user-preferences.query';

@Component({
  selector: 'mg-instances-container',
  templateUrl: './instances-container.component.html',
  styleUrls: ['./instances-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstancesContainerComponent implements OnInit {
  instances$ = this.interfaceQuery.instances$;
  active$ = this.interfaceQuery.activeInstance$;

  @ViewChildren('accounts') accounts: QueryList<ElementRef<HTMLDivElement>>;

  @ViewChild('partyInfos') partyInfosRef: ElementRef<HTMLDivElement>;

  listenedInstancesId: string[] = [];

  gameReady$ = combineLatest([
    this.installationQuery.fsBusy$,
    this.installationQuery.gameUpdated$,
  ]).pipe(
    map(([fs, update]) => !fs && !!update),
    tap(() => setTimeout(() => this.cdRef.detectChanges())),
  );

  navAlign$ = this.preferencesQuery.accountsNavAlign$;

  updateSource$ = interval(5000);

  constructor(
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef,
    private interfaceStore: UserInterfaceStore,
    private interfaceQuery: UserInterfaceQuery,
    private installationQuery: InstallationQuery,
    private preferencesQuery: UserPreferencesQuery,
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

        instance.fightTurnStart$.subscribe(() => {
          this.setActive(instance);
          this.cdRef.detectChanges();
        });

        this.listenedInstancesId.push(instance.ID);
      });
    });

    this.updateSource$
      .pipe(switchMap(() => this.instances$))
      .subscribe((instances) => {
        const dc = instances.reduce((acc, i) => acc + i.dropChance, 0);
        const lvl = instances.reduce((acc, i) => acc + i.level, 0);

        instances.forEach(instance => instance.addPartyInformations(dc, lvl));
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
