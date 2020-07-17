import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { GameInstance } from '@model';
import {
  InstancesService,
  KeyboardShortcutsService,
  MgKeyboardShortcut,
  SystemService,
} from '@providers';
import { Subscription, timer } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { InstallationService } from 'src/app/core/installation/installation.service';

@Component({
  selector: 'mg-game-instance',
  templateUrl: './game-instance.component.html',
  styleUrls: ['./game-instance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class GameInstanceComponent implements OnInit, OnDestroy {
  @Input() instance: GameInstance;

  src$ = this.installation.gamePath$;

  private susbscriptions = new Subscription();

  constructor(
    private installation: InstallationService,
    private instancesService: InstancesService,
    private zone: NgZone,
    private shortcuts: KeyboardShortcutsService,
    private system: SystemService,
  ) {}

  ngOnDestroy() {
    this.susbscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.zone.run(() => {
      this.instance.actions.connectAccount();

      this._setActiveOnTurnStart();

      this.susbscriptions.add(
        this.instance.events.characterLogin$.subscribe(() => {
          this.instance.actions.removeShopButton();
          this.instance.injecter.addSpellsDoubleTapListener();
        }),
      );

      this.susbscriptions.add(
        this.instance.events.characterLogin$
          .pipe(switchMap(() => timer(60000, 60000)))
          .subscribe(() => this.instance.actions.preventInactivity()),
      );

      this.susbscriptions.add(
        this.instance.groupManager.partyInfo$.subscribe((infos) => {
          const placeholder = this.instance.injecter.placeholderPartyInfo;
          if (!placeholder) return;
          placeholder.innerHTML = `🌟 ${infos.level} <br /> 🔎 ${infos.dropChance}`;
        }),
      );

      this.susbscriptions.add(
        this.instance.events.characterLogin$
          .pipe(
            filter(() => !this.system.isCordova),
            tap(() => this.instance.injecter.addBindingsToShortcutSlots()),
            switchMap(() => this.shortcuts.slotShortcuts$),
          )
          .subscribe((shortcuts) => this._addShortcutsKeysToSlots(shortcuts)),
      );

      this.susbscriptions.add(
        this.instance.events.keyDown$
          .pipe(filter(() => !this.system.isCordova))
          .subscribe((event) =>
            this.shortcuts.runShortcut(this.instance, event),
          ),
      );
    });
  }

  /**
   * On fight turn start, sets the instance as active
   */
  private _setActiveOnTurnStart() {
    this.susbscriptions.add(
      this.instance.events.characterFightTurnStart$.subscribe(() => {
        this.instancesService.setActiveInstance(this.instance);
      }),
    );
  }

  /**
   * Adds the shortcuts bindings on the slots
   * @param shortcuts Shortcuts to bind to the slots
   */
  private _addShortcutsKeysToSlots(shortcuts: MgKeyboardShortcut[]) {
    const [spellsSlotsEls, itemsSlotsEls] = [
      this.instance.gui.spellsSlots.map((v) => v.rootElement),
      this.instance.gui.itemsSlots.map((v) => v.rootElement),
    ];

    shortcuts.forEach((shortcut) =>
      this.instance.gui.setShortcutBindingOnSlot(
        shortcut.slotIndex,
        shortcut.name,
      ),
    );
  }
}
