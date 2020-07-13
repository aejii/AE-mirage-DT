import { GameInstance } from '../classes/game-instance';
import { GameMenuBarIconsNames } from '../DT/window';

export class MgActionsHandler {
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

  /** Clicks on a menu icon such as equipment, caracs, etc. */
  clickOnMenuIcon(menu: GameMenuBarIconsNames) {
    this.instance.window?.gui?.menuBar?._icons?._childrenMap?.[menu]?.tap?.();
  }

  /** Clicks on the ready / skip turn button */
  clikOnReadyButton() {
    const state = this.instance.window?.gui?.fightManager?.fightState ?? -1;
    if (state === 0) {
      this.instance.fightManager.readyButton?.tap();
    } else if (state === 1) {
      this.instance.fightManager.endTurnButton?.tap();
    }
  }

  /** Uses a spell/item in the currently displayed panel  */
  useSlotInCurrentPanel(slotIndex: number) {
    this.instance.gui.currentSlotsPanel?.slotList?.[slotIndex]?.emit?.(
      // Select instead of use if in fight
      this.instance.gui.currentPanelType === 'spell' ? 'tap' : 'doubletap',
    );
  }
}
