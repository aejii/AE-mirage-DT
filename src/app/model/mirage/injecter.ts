import { first } from 'rxjs/operators';
import { GameInstance } from '../classes/game-instance';
import { EventReadyObject } from '../DT/window';
import { ExchangeWindowSlot } from './singletons';

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

      this.instance.events.subscriptions.add(
        this.instance.events.characterLogout$.subscribe(() =>
          slot?.removeListener?.('doubletap', slot._events.doubletap),
        ),
      );

      return slot;
    });
  }

  /** Manages listeners on the exchange/storage/craft windows, to allow Ctrl + click to send all selected objects at once */
  manageQuickExchange() {
    this._manageDoubletapOnExchangeSlot(
      this.instance.gui.characterExchangeInventory,
      true,
    );
    this._manageDoubletapOnExchangeSlot(
      this.instance.gui.exchangeInventoryWindow,
      true,
    );
    this._manageDoubletapOnExchangeSlot(
      this.instance.gui.exchangeStorageWindow,
      false,
    );

    this._manageDoubletapOnExchangeSlot(
      this.instance.gui.craftingInventoryWindow,
      true,
    );

    /**
     * Edits the doubletap listener for objects added into the exchange interface
     */
    this.instance.window.gui.on('ExchangeObjectAddedMessage', (event) => {
      const slot = this.instance.gui?.characterExchangeInterface?._myTradeSpace
        ?._allSlots?._childrenMap?.['slot' + event.object.objectUID];
      if (!slot) return;
      this._manageDoubletapOnExchangeSlotInExchange(slot, false);
    });
  }

  /**
   * On ctrl + double click, sends the selected object to the other window.
   * The other window is internally managed, so no need to know it.
   * Also, the events are destroyed when the window is closed, so no need to delete them by hand.
   */
  private _manageDoubletapOnExchangeSlot(
    target: EventReadyObject,
    fromInventory: boolean,
  ) {
    if (!target) return;
    target.addListener('opened', () => {
      const originalListener = target?._events?.['slot-doubletap']?.bind(
        target,
      );

      // Don't know why by the remove listener does not work on this event, doing it by hand
      // target.removeListener('slot-doubletap', originalListener);
      delete target._events['slot-doubletap'];

      target.addListener(
        'slot-doubletap',
        (item: ExchangeWindowSlot, ...args) =>
          this.instance.events.isCtrlPressed$
            .pipe(first())
            .subscribe((ctrlKey) =>
              !ctrlKey
                ? originalListener(item, ...args)
                : this.instance.actions.TransferObjectForExchange(
                    item?.itemInstance?.objectUID,
                    item?.getQuantity?.(),
                    fromInventory,
                  ),
            ),
      );
    });
  }

  /**
   * On ctrl + double click, sends every item in the trade window to the inventory window.
   * The trade window has a different behavior than the other ones, hence the specific method.
   */
  private _manageDoubletapOnExchangeSlotInExchange(
    slot: ExchangeWindowSlot,
    fromInventory: boolean,
  ) {
    const originalListener = slot?._events?.doubletap?.bind(slot);
    slot?.removeListener?.('doubletap', slot._events.doubletap);
    slot?.addListener?.('doubletap', (event) =>
      this.instance.events.isCtrlPressed$
        .pipe(first())
        .subscribe((ctrlKey) =>
          !ctrlKey
            ? originalListener(event)
            : this.instance.actions.TransferObjectForExchange(
                slot?.itemInstance?.objectUID,
                slot?.getQuantity?.(),
                fromInventory,
              ),
        ),
    );
  }
}
