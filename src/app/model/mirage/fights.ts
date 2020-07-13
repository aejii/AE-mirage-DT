import { GameInstance } from '../classes/game-instance';

export class MgFightHandler {
  constructor(private instance: GameInstance) {}

  get fightersList() {
    return this.instance.window?.gui?.fightManager?._fighters;
  }

  get selfTarget() {
    return this.fightersList[this.instance.character.id];
  }

  get readyButton() {
    return this.instance.window?.gui?.timeline?.fightControlButtons?._fightReadyBtn;
  }

  get endTurnButton() {
    return this.instance.window?.gui?.timeline?.fightControlButtons?._turnReadyBtn;

  }
}