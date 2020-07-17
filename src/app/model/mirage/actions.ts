import { concat, forkJoin, of } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { GameInstance } from '../classes/game-instance';
import { GameMenuBarIconsNames } from '../DT/window';

export class MgActionsHandler {
  constructor(private instance: GameInstance) {}

  /** Clicks on a menu icon such as equipment, caracs, etc. */
  clickOnMenuIcon(menu: GameMenuBarIconsNames) {
    this.instance.window?.gui?.menuBar?._icons?._childrenMap?.[menu]?.tap?.();
  }

  /** Uses a spell/item in the currently displayed panel and the current tab  */
  useSlotInCurrentPanel(slotIndex: number) {
    const index = this.instance.gui.currentSlotsPanel?.index;
    this.instance.gui.currentSlotsPanel?.slotList?.[
      slotIndex + index * 30
    ]?.emit?.(
      // Select instead of use if in fight
      this.instance.gui.currentPanelType === 'spell' ? 'tap' : 'doubletap',
    );
  }

  /** Clicks on the settings button in the main controls of the game */
  showSettings() {
    this.instance.window?.gui?.mainControls?.buttonBox?._childrenList
      ?.slice(-1)
      ?.pop()
      ?.tap?.();
  }

  /**
   * Prevents user inactivity by recording activity
   */
  preventInactivity() {
    this.instance.singletons.activityRecorder?.recordActivity?.();
  }

  /** Removes this fucking annoying shop button */
  removeShopButton() {
    // Timeout because on connection, might not be declared yet
    setTimeout(() => this.instance.window?.gui?.shopFloatingToolbar?.hide?.());
  }

  /** Refreshes the interface by resizing the menus and redrawing the canvas to fill the screen */
  refreshInterface(zoom = 2) {
    try {
      this.instance.singletons.dimensionsManager.dimensions.viewportWidth = 0;
      this.instance.singletons.dimensionsManager.dimensions.viewportHeight = 0;
      this.instance.window.isoEngine.mapScene.camera.maxZoom = zoom;
      this.instance.singletons.dimensionsManager.updateScreen();
      this.instance.window?.gui?._resizeUi?.();
    } catch (e) {}
  }

  /**
   * Removes a notification from the side of the screen
   */
  removeNotification(notificationId: string) {
    this.instance.window?.gui?.notificationBar?.removeNotification?.(
      notificationId,
    );
  }

  /**
   * Collapses the part element to hide it
   */
  hidePartyDetails() {
    this.instance.window.gui?.party?.collapse?.();
  }

  /**
   * Opens up the chat
   */
  toggleChat(forceValue?: boolean) {
    const shouldShow = forceValue ?? !this.instance.gui.chatWindow?.active;
    if (shouldShow) this.instance.gui.chatWindow?.activate?.();
    else this.instance.gui.chatWindow?.deactivate?.();
  }

  /** Connects the account associated to the instance */
  connectAccount() {
    if (!this.instance.account) return;

    this.instance.events.gameInit$
      .pipe(
        delay(500),
        tap(() => this.instance.window.gui.loginScreen.showLoginForm()),
        switchMap(() =>
          emulateUserTyping$(
            this.instance.gui.loginForm.username,
            this.instance.account.username,
          ),
        ),
        switchMap(() =>
          emulateUserTyping$(
            this.instance.gui.loginForm.password,
            this.instance.account.password,
          ),
        ),
      )
      .subscribe(() => {
        this.instance.gui.loginForm.rememberName.activate();
        this.instance.gui.loginForm.play();
      });
  }
}

/**
 * Simulates a user typing in the input
 * @param input HTML Input Element to type in
 * @param content Content to type
 */
function emulateUserTyping$(input: HTMLInputElement, content: string) {
  return forkJoin([
    concat(
      ...content.split('').map((letter) => of(letter).pipe(delay(50))),
    ).pipe(tap((letter) => (input.value += letter))),
  ]);
}
