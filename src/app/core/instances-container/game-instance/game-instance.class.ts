import { Observable } from 'rxjs';
import { filter, first, map, shareReplay, switchMap } from 'rxjs/operators';
import { gameCharacterUtils } from '../../model/game/utils/character.utils';
import { gameEventsUtils } from '../../model/game/utils/events.utils';
import { gameFightUtils } from '../../model/game/utils/fight.utils';
import { gameFinderUtils } from '../../model/game/utils/finder.utils';
import { gameGuiUtils } from '../../model/game/utils/gui-utils';
import { rxjsUtils } from '../../model/game/utils/rxjs.utils';
import { GameWindow } from '../../model/game/window.interface';

export class GameInstance {
  public window: GameWindow;

  // ---------- LIFECYCLE EVENTS ----------

  loginReady$ = rxjsUtils.waitForTruthiness$(
    () => gameGuiUtils.getLoginForm(this.window),
    true,
  );

  connect$ = this._fromGuiCallback$('connected');
  disconnect$ = this._fromGuiCallback$('disconnect');

  fightTurnStart$ = this._fromGuiCallback$<{ id: number }>(
    'GameFightTurnStartMessage',
  ).pipe(
    filter(
      (response) => response?.id === gameCharacterUtils.getId(this.window),
    ),
  );

  characterImage$ = this.connect$.pipe(
    map(() => gameGuiUtils.getCharacterImage(this.window)),
    shareReplay(),
  );

  castSpellInFight$ = this._fromGuiCallback$<number>('spellSlotSelected').pipe(
    filter(() => gameFightUtils.isFighting(this.window)),
  );

  public readonly ID = Math.random().toString(36).slice(2);

  // ---------- CONVENIENCE GETTERS ----------

  get characterName() {
    return gameCharacterUtils.getName(this.window);
  }

  get dropChance() {
    return gameCharacterUtils.getDropChance(this.window);
  }

  get level() {
    return gameCharacterUtils.getLevel(this.window);
  }

  constructor() {
    // Used to not make a subscribe into another subscribe
    let slots: any[];

    this.connect$.subscribe(() => {
      gameGuiUtils.removeShopButton(this.window);
      gameEventsUtils.preventUserInactivity(this.window);
      slots = this.addSpellsDoubleTapListener();
    });

    this.disconnect$.subscribe(() => {
      slots?.forEach((slot) =>
        slot?.removeListener?.('doubletap', slot._events.doubletap),
      );
    });
  }

  // Listens for a double tap on a spell and casts it on self when in fight
  private addSpellsDoubleTapListener() {
    const slots = gameGuiUtils.getSpellsShortcutSlots(this.window);
    return slots.map((slot) => {
      slot.addListener('doubletap', () => {
        if (!gameFightUtils.isFighting(this.window)) return;

        const fighters = gameFightUtils.getFighters(this.window);
        const fighter = fighters[gameCharacterUtils.getId(this.window)];
        const cellId = fighter.data?.disposition?.cellId;
        const spellId = slot.data?.id;

        if (cellId && spellId) {
          this.window.foreground.selectSpell(spellId);
          this.window.isoEngine._castSpellImmediately(cellId);
        }
      });

      return slot;
    });
  }

  /**
   * Attaches a frame window to the instance
   * @param window Frame window object
   */
  frameLoaded(frame: HTMLIFrameElement) {
    this.window = frame.contentWindow as GameWindow;
    gameFinderUtils.attachFinderToWindow(this.window);
  }

  /**
   * Connects an account to the game
   */
  connect(username: string, password: string, remember = false) {
    this.loginReady$.pipe(first()).subscribe((form) => {
      form._inputLogin.rootElement.value = username;
      form._inputPassword.rootElement.value = password;
      if (remember) form._rememberName.activate();
      else form._rememberName.deactivate();
      form._play();
    });
  }

  /** Refreshes the game GUI (useful for when the UI has bugs) */
  refresh() {
    gameGuiUtils.refreshGui(this.window);
  }

  muteAllSounds(mute: boolean = false) {
    // TODO
  }

  sendPartyInvite(playerName: string) {
    gameEventsUtils.sendPartyInvite(this.window, playerName);
  }

  /** Accepts a party invite and collapses the GUI party element */
  waitForPartyInvite() {
    gameEventsUtils.waitForPartyInvite(this.window);
  }

  /** Adds the party level and drop chance to the GUI party element */
  addPartyInformations(dropChance: number, level: number) {
    if (!gameCharacterUtils.hasParty(this.window)) return;

    const partyContainer: HTMLElement = this.window?.gui?.party?.classicParty
      ?.rootElement;

    if (!partyContainer) return;

    let hasInfosAlready = false;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < partyContainer.children.length; i++) {
      if (!partyContainer.children[i].classList.contains('member'))
        hasInfosAlready = true;
    }

    if (hasInfosAlready) {
      partyContainer.children[0].textContent = '🍀  ' + dropChance;
      partyContainer.children[1].textContent = '🌟  ' + level;
    } else {
      const lvl = document.createElement('div');
      const dc = document.createElement('div');

      [lvl, dc].forEach((el) => {
        el.style.padding = '0 0.25em';
        el.style.textAlign = 'left';
      });
      lvl.style.paddingBottom = '0.5em';

      dc.textContent = '🍀  ' + dropChance;
      lvl.textContent = '🌟  ' + level;

      partyContainer.insertBefore(lvl, partyContainer.firstChild);
      partyContainer.insertBefore(dc, partyContainer.firstChild);
    }
  }

  /** Creates an observable from a window.gui.on(verb) callback */
  private _fromGuiCallback$<T>(
    verb: string,
    listenOnce = false,
    forceValue?: T,
  ) {
    return rxjsUtils
      .waitForTruthiness$(() => this.window?.gui?.on)
      .pipe(
        switchMap(
          () =>
            new Observable<T>((handler) => {
              this.window.gui.on(verb, (v) => {
                handler.next(forceValue ?? v);
                if (listenOnce) handler.complete();
              });
            }),
        ),
      );
  }
}