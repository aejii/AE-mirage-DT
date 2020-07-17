import { fromEvent, interval, Observable } from 'rxjs';
import {
  debounceTime,
  delay,
  filter,
  first,
  map,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';
import { GameInstance } from '../classes/game-instance';

export class MgEventsHandler {
  /** Triggers once, when the game has loaded its loading screen */
  gameInit$ = waitForTruthiness$(
    () => this.instance?.window?.gui?.loginScreen?._loginForm,
    true,
  );

  /** Emits everytime the character reaches the world */
  characterLogin$ = fromGuiCallback$(this.instance, 'connected');
  /** Emits everytime the character leaves the world */
  characterLogout$ = fromGuiCallback$(this.instance, 'disconnect');

  /** Emits everytime the character turn starts */
  characterFightTurnStart$ = fromGuiCallback$<{ id: number }>(
    this.instance,
    'GameFightTurnStartMessage',
  ).pipe(filter((response) => response?.id === this.instance.character.id));

  /** Emits everytime the character casts a spell during a fight */
  characterSpellCast$ = fromGuiCallback$<number>(
    this.instance,
    'spellSlotSelected',
  ).pipe(filter(() => !!this.instance.character.isFighting));

  // Emits everytime a user presses a keyboard key outside of an input
  public keyboardShortcutPressed$ = waitForTruthiness$(
    () => this.instance.window,
    true,
  ).pipe(
    switchMap(() => fromEvent<KeyboardEvent>(this.instance.window, 'keyup')),
    filter((event) => event.target.constructor.name !== 'HTMLInputElement'),
    filter((event) => event.target.constructor.name !== 'HTMLTextAreaElement'),
    filter((event) => !event.ctrlKey && !event.altKey && !event.shiftKey),
  );

  /**
   * Ctrl + W on keydown shortcut = the user asked to close the account
   * Bound on keydown because if on keyup, will close the main window !
   */
  public instanceCloseShortcut$ = waitForTruthiness$(
    () => this.instance.window,
    true,
  ).pipe(
    switchMap(() => fromEvent<KeyboardEvent>(this.instance.window, 'keydown')),
    filter((event) => event.key === 'w' && event.ctrlKey),
    tap((event) => {
      event.preventDefault();
      event.stopPropagation();
    }),
  );

  public keyDown$ = waitForTruthiness$(() => this.instance.window, true).pipe(
    switchMap(() => fromEvent<KeyboardEvent>(this.instance.window, 'keydown')),
    filter((event) => !event.repeat),
  );

  constructor(private instance: GameInstance) {
    // Bind the finders to the instance window
    waitForTruthiness$(() => this.instance.window, true).subscribe(() => {
      (this.instance
        .window as any).wFind = this.instance.finder.searchForKeyInWindowObjects.bind(
        this.instance.finder,
      );
      (this.instance
        .window as any).sFind = this.instance.finder.searchForKeyInSingletonObjects.bind(
        this.instance.finder,
      );

      (this.instance
        .window as any).mgTest = this.instance.finder.getSingletonConstructorWithKey.bind(
        this.instance.finder,
      );

      this.characterLogin$.pipe(delay(5000)).subscribe(() => {
        this.instance.gui.refreshInterface();
      });

      fromEvent<UIEvent>(this.instance.window, 'resize')
        .pipe(debounceTime(100))
        .subscribe(() => {
          this.instance.gui.refreshInterface();
        });
    });
  }

  preventInactivity() {
    this.instance.singletons.activityRecorder?.recordActivity?.();
  }
}

/**
 * Waits for the given callback to return a truthy value
 */
function waitForTruthiness$<T>(
  callback: () => T,
  listenOnce = false,
  checkInterval = 100,
) {
  const ret = interval(checkInterval).pipe(
    map(callback),
    filter((v) => !!v),
  );

  if (listenOnce) return ret.pipe(first());
  return ret.pipe(first(), shareReplay());
}

/**
 * Listens to the provided instance's GUI verb
 */
function fromGuiCallback$<T>(
  instance: GameInstance,
  verb: string,
  listenOnce = false,
  returnValue?: T,
) {
  return waitForTruthiness$(() => instance.window?.gui?.on).pipe(
    switchMap(
      () =>
        new Observable<T>((handler) => {
          instance.window.gui.on(verb, (v) => {
            handler.next(returnValue ?? v);
            if (listenOnce) handler.complete();
          });
        }),
    ),
  );
}
