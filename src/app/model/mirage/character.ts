import { GameInstance } from '../classes/game-instance';

export class MgCharacterHandler {
  get id() {
    return this.instance?.window?.gui?.playerData?.id;
  }

  get name() {
    return this.instance?.window?.gui?.playerData?.characterBaseInformations
      ?.name;
  }

  get dropChance() {
    return (
      this.instance?.window?.gui?.playerData?.characters?.mainCharacter?.characteristics?.prospecting?.getTotalStat?.() ??
      0
    );
  }

  get level() {
    return (
      this.instance?.window?.gui?.playerData?.characterBaseInformations
        ?.level ?? 0
    );
  }

  get hasParty() {
    return (
      !!this.instance?.window?.gui?.party?.currentParty?._childrenList?.filter?.(
        (c) => !!c.memberData,
      )?.length ?? false
    );
  }

  get isFighting() {
    return !!this.instance.window?.gui?.playerData?.isFighting;
  }

  get entityLook() {
    return this.instance.window?.gui?.playerData?.characterBaseInformations
      ?.entityLook;
  }

  constructor(private instance: GameInstance) {}
}
