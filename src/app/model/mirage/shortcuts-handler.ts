import { GameInstance } from '../classes/game-instance';

export class MgShortcutsHandler {
  private spellSlots: any[];

  constructor(private instance: GameInstance) {}

  // TODO See if it can be ran only once on instance creation
  addSpellsDoubleTapListener() {
    const slots = this.instance.gui.spellsSlots;
    this.spellSlots = slots.map((slot) => {
      slot.addListener('doubletap', () => {
        if (!this.instance.character.isFighting) return;

        const fighter = this.instance.fightManager.selfTarget;
        const cellId = fighter.data?.disposition?.cellId;
        const spellId = slot.data?.id;

        if (cellId && spellId) {
          this.instance.window.foreground.selectSpell(spellId);
          this.instance.window.isoEngine._castSpellImmediately(cellId);
        }
      });

      this.instance.events.characterLogout$.subscribe(() =>
        slot?.removeListener?.('doubletap', slot._events.doubletap),
      );

      return slot;
    });
  }
}
