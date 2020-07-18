import { fromEvent, interval, merge, Observable, Subscription, BehaviorSubject } from 'rxjs';
import {
  filter,
  first,
  map,
  mapTo,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { GameInstance } from '../classes/game-instance';
import { WindowGuiEventVerb } from '../DT/window';

export class MgEventsHandler {
  public subscriptions = new Subscription();

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

  /** Emits when the user presses a key on his keyboard */
  public keyDown$ = waitForTruthiness$(() => this.instance.window, true).pipe(
    switchMap(() => fromEvent<KeyboardEvent>(this.instance.window, 'keydown')),
    filter((event) => !event.repeat),
  );

  /** Emits when the user releases a key pressed on his keyboard */
  public keyUp$ = waitForTruthiness$(() => this.instance.window, true).pipe(
    switchMap(() => fromEvent<KeyboardEvent>(this.instance.window, 'keyup')),
  );

  private _ctrlPressed = new BehaviorSubject(false);
  public isCtrlPressed$ = this._ctrlPressed.asObservable();

  constructor(private instance: GameInstance) {
    this.subscriptions.add(
      this.keyDown$
        .pipe(
          filter((event) => event.key === 'Control'),
          mapTo(true),
        )
        .subscribe(v => this._ctrlPressed.next(v)),
    );
    this.subscriptions.add(
      this.keyUp$
        .pipe(
          filter((event) => event.key === 'Control'),
          mapTo(false),
        )
        .subscribe(v => this._ctrlPressed.next(v)),
    );
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
  verb: WindowGuiEventVerb,
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
