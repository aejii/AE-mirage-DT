import { GameInstance } from '../classes/game-instance';

export class MgFightHandler {
  constructor(private instance: GameInstance) {}

  get fightersList() {
    return this.instance.window?.gui?.fightManager?._fighters;
  }

  get selfTarget() {
    return this.fightersList[this.instance.character.id];
  }

  private get readyButton() {
    return this.instance.window?.gui?.timeline?.fightControlButtons
      ?._fightReadyBtn;
  }

  private get endTurnButton() {
    return this.instance.window?.gui?.timeline?.fightControlButtons
      ?._turnReadyBtn;
  }

  get fightState() {
    return this.instance.window?.gui?.fightManager?.fightState ?? -1;
  }

  get timelineButton() {
    return this.fightState === 0
      ? this.readyButton
      : this.fightState === 1
      ? this.endTurnButton
      : undefined;
  }

  clickOnTimelineButton() {
    this.timelineButton.tap();
  }
}
