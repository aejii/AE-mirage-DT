import { interval, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { GameWindow } from '../window.interface';
import { gameGuiUtils } from './gui-utils';

export const gameEventsUtils = {
  sendPartyInvite,
  waitForPartyInvite,
  preventUserInactivity,
};

function sendPartyInvite(window: GameWindow, playerName: string) {
  window?.dofus?.connectionManager?.sendMessage?.(
    'PartyInvitationRequestMessage',
    {
      name: playerName,
    },
  );
}

function preventUserInactivity(window: GameWindow) {
  interval(30000).subscribe(() => {
    window?.mirageInactivity?.recordActivity?.();
  });
}

function waitForPartyInvite(window: GameWindow) {
  const sub = new Subject<any>();

  sub.pipe(first()).subscribe(({ partyId }) => {
    window?.dofus?.connectionManager?.sendMessage?.(
      'PartyAcceptInvitationMessage',
      {
        partyId,
      },
    );
    gameGuiUtils.removeNotification(window, 'party' + partyId);
    gameGuiUtils.collapsePartyElement(window);
  });

  window?.dofus?.connectionManager?.on?.('PartyInvitationMessage', (response) =>
    sub.next(response),
  );
}
