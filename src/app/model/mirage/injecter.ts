import { GameInstance } from '../classes/game-instance';

export class MgInjecter {
  get placeholderPartyInfo() {
    const placeholderClass = 'mirage-party-infos';

    const partyEl = this.instance.window?.gui?.party?.classicParty;
    const groupLeaderEl = partyEl?._childrenList[0]?.rootElement;
    let placeholder: HTMLElement = partyEl?.rootElement?.querySelector?.(
      `.${placeholderClass} span`,
    );

    if (!partyEl || !groupLeaderEl) return undefined;
    else if (placeholder) return placeholder;
    else {
      placeholder = document.createElement('div');
      placeholder.classList.add(placeholderClass);
      placeholder.style.display = 'flex';
      placeholder.style.flexFlow = 'row';
      placeholder.style.alignItems = 'center';
      placeholder.style.justifyContent = 'center';
      const span = document.createElement('span');
      placeholder.appendChild(span);
      partyEl.rootElement.insertBefore(placeholder, groupLeaderEl);

      return span;
    }
  }

  constructor(private instance: GameInstance) {}

  addBindingsToShortcutSlots() {
    const slots = [
      ...this.instance.gui.spellsSlots,
      ...this.instance.gui.itemsSlots,
    ].map((v) => v.rootElement);

    slots.forEach((slot) => {
      const div = document.createElement('div');
      div.className = 'mirage-shortcut-key quantity';
      slot.appendChild(div);
    });
  }

  /** Adds a doubletap listener on the slots, that targets the user's own character */
  addSpellsDoubleTapListener() {
    const slots = this.instance.gui.spellsSlots;
    slots.map((slot) => {
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
