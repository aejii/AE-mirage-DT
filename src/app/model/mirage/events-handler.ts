import { interval, Observable, Subject } from 'rxjs';
import { filter, first, map, shareReplay, switchMap } from 'rxjs/operators';
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

  constructor(private instance: GameInstance) {
    this.characterLogin$.subscribe(() => {
      this.instance.gui.removeShopButton();
      this.preventInactivity();
    });
  }

  preventInactivity() {
    interval(30000).subscribe(() => {
      this.instance.window?.mirageInactivity?.recordActivity?.();
    });
  }

  sendPartyInviteTo(name: string) {
    this.instance.window?.dofus?.connectionManager?.sendMessage?.(
      'PartyInvitationRequestMessage',
      { name },
    );
  }

  acceptNextPartyInvite() {
    const sub = new Subject<any>();

    sub.pipe(first()).subscribe(({ partyId }) => {
      this.instance.window?.dofus?.connectionManager?.sendMessage?.(
        'PartyAcceptInvitationMessage',
        {
          partyId,
        },
      );
      this.instance.gui.removeNotification('party' + partyId);
      this.instance.gui.hidePartyDetails();
    });

    this.instance.window?.dofus?.connectionManager?.on?.(
      'PartyInvitationMessage',
      (response) => sub.next(response),
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
