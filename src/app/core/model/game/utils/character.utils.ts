import { GameWindow } from '../window.interface';

export const gameCharacterUtils = {
  getId,
  getName,
  getLevel,
  getDropChance,
  hasParty,
};

function getId(window: GameWindow): number {
  return window?.gui?.playerData?.id;
}

function getName(window: GameWindow) {
  return window?.gui?.playerData?.characterBaseInformations?.name;
}

function hasParty(window: GameWindow) {
  return !!window?.gui?.party?.currentParty?._childrenList?.filter?.(
    (c) => !!c.memberData,
  )?.length ?? false;
}

function getDropChance(window: GameWindow): number {
  return (
    window?.gui?.playerData?.characters?.mainCharacter?.characteristics?.prospecting?.getTotalStat?.() ??
    0
  );
}

function getLevel(window: GameWindow): number {
  return window?.gui?.playerData?.characterBaseInformations?.level ?? 0;
}
