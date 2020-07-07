import { Subject, timer } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { GameInstance } from '../classes/game-instance';

const updateSource$ = timer(0, 5000);

export class MgGroupHandler {
  /** Total level and drop chance of the party */
  partyInfo$ = updateSource$.pipe(
    map(() =>
      this.membersData.reduce(
        (acc, curr) => ({
          level: acc.level + (curr?.level ?? 0),
          dropChance: acc.dropChance + (curr?.prospecting ?? 0),
        }),
        { level: 0, dropChance: 0 },
      ),
    ),
    filter((info) => !!info.level && !!info.dropChance),
  );

  private get membersData() {
    return (
      this.instance.window?.gui?.party?.currentParty?._childrenList.map(
        (el) => el.memberData,
      ) ?? []
    );
  }

  constructor(private instance: GameInstance) {}

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
