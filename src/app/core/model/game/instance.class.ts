import { interval, Observable, Subject } from 'rxjs';
import { filter, first, map, shareReplay, switchMap } from 'rxjs/operators';
import { GameWindow } from './window.interface';

const source$ = interval(100);

export class GameInstance {
  private window: GameWindow;

  loginReady$ = source$.pipe(
    map(() => this.window?.gui?.loginScreen?._loginForm),
    filter((v) => !!v),
    first(),
  );

  connect$ = source$.pipe(
    map(() => this.window?.gui?.on),
    filter((v) => !!v),
    first(),
    switchMap(
      (on: (v, cb) => void) =>
        new Observable((observer) =>
          this.window.gui.on('connected', (v) => observer.next(v)),
        ),
    ),
  );

  disconnect$ = source$.pipe(
    map(() => this.window?.gui?.on),
    filter((v) => !!v),
    first(),
    switchMap(
      (on: (v, cb) => void) =>
        new Observable((observer) =>
          this.window.gui.on('disconnect', (v) => observer.next(v)),
        ),
    ),
  );

  fightTurnStart$ = source$.pipe(
    map(() => this.window?.gui?.on),
    filter((v) => !!v),
    first(),
    switchMap(
      () =>
        new Observable<{ id: number }>((observer) =>
          this.window.gui.on('GameFightTurnStartMessage', (v: { id: number }) =>
            observer.next(v),
          ),
        ),
    ),
    filter((response) => response?.id === this.characterId),
  );

  characterImage$ = this.connect$.pipe(
    map(() => {
      const char = this.getCharacterImage();
      const canvas = char.canvas;
      const canvasEl: HTMLCanvasElement = char.rootElement;

      canvas.width = 128;
      canvas.height = 128;

      char._render();

      return canvasEl;
    }),
    shareReplay(),
  );

  public readonly ID = Math.random().toString(36).slice(2);

  get characterName() {
    return this.window?.gui?.playerData?.characterBaseInformations?.name;
  }

  get characterId() {
    return this.window?.gui?.playerData?.id;
  }

  constructor() {
    this.connect$.subscribe((v) => {
      this.removeShopButton();
      this.preventUserInactivity();
      this.bindSpellDoubleTap();
    });
  }

  private bindSpellDoubleTap() {
    this.window?.gui?.shortcutBar?._panels?.spell?.slotList?.forEach((slot) => {
      slot.addListener('doubletap', () => {
        if (!this.window?.gui?.playerData?.isFighting) return;

        const cellId = this.window?.gui?.fightManager?._fighters[
          this.window?.gui?.playerData?.characterBaseInformations?.id
        ]?.data?.disposition?.cellId;
        const spellId = slot.data?.id;

        if (cellId && spellId)
          this.window.dofus.sendMessage('GameActionFightCastRequestMessage', {
            cellId,
            spellId,
          });
      });

      this.disconnect$
        .pipe(first())
        .subscribe(() =>
          slot.removeListener('doubletap', slot._events.doubletap),
        );
    });
  }

  /**
   * Attaches a frame window to the instance
   * @param window Frame window object
   */
  frameLoaded(frame: HTMLIFrameElement) {
    this.window = frame.contentWindow as GameWindow;
    this.enableResizing();
  }

  connect(username: string, password: string, remember = false) {
    this.loginReady$.pipe(first()).subscribe((form) => {
      form._inputLogin.rootElement.value = username;
      form._inputPassword.rootElement.value = password;
      if (remember) form._rememberName.activate();
      else form._rememberName.deactivate();
      form._play();
    });
  }

  refresh() {
    try {
      this.window?.gui?._resizeUi();
    } catch (error) {}
  }

  /** Returns an object that manages the inventory image of a character */
  getCharacterImage(): any {
    const char = new this.window.CharacterDisplay({ scale: 'fitin' });
    char.setLook(
      this.window.gui.playerData.characterBaseInformations.entityLook,
      {
        riderOnly: true,
        direction: 4,
        animation: 'AnimArtwork',
        boneType: 'timeline/',
        skinType: 'timeline/',
      },
    );

    char.horizontalAlign = 'center';
    char.verticalAlign = 'top';

    return char;
  }

  private removeShopButton() {
    // Make it run after the original command with a timeout
    setTimeout(() => this.window.gui.shopFloatingToolbar.hide());
  }

  private preventUserInactivity() {
    interval(30000).subscribe(() => {
      this.window.mirageInactivity.recordActivity();
    });
  }

  private enableResizing() {
    this.window.onresize = (event: UIEvent) => {
      // Singleton update required because unlike a computer, the browser size does not change
      const screen = this.window.singletons?.(179);
      if (!screen) return;
      screen.dimensions.viewportWidth = this.window.document.documentElement.clientWidth;
      screen.updateScreen();
      this.refresh();
    };
  }

  muteAllSounds(mute: boolean = false) {
    const audio = this.window?.singletons?.(254);
    if (!audio) return;
    audio.setMute?.(mute);
  }

  removeNotification(notificationId: string) {
    this.window.gui.notificationBar.removeNotification(notificationId);
  }

  sendPartyInvite(playerName: string) {
    this.window.dofus.sendMessage('PartyInvitationRequestMessage', {
      name: playerName,
    });
  }

  waitForPartyInvite() {
    const sub = new Subject<any>();

    sub.pipe(first()).subscribe(({ partyId }) => {
      this.window.dofus.sendMessage('PartyAcceptInvitationMessage', {
        partyId,
      });
      this.removeNotification('party' + partyId);
      this.collapsePartyElement();
    });

    this.window.dofus.on('PartyInvitationMessage', (response) =>
      sub.next(response),
    );
  }

  collapsePartyElement() {
    this.window.gui.party.collapse();
  }
}
