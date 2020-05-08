import { GameWindow } from '../window.interface';

export const gameFightUtils = {
  getFighters,
  isFighting,
};

function getFighters(window: GameWindow) {
  return window?.gui?.fightManager?._fighters ?? undefined;
}

function isFighting(window: GameWindow): boolean {
  return window?.gui?.playerData?.isFighting;
}