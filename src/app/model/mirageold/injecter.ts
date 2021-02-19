import { timer } from 'rxjs';
import { first, take } from 'rxjs/operators';
import { GameInstance } from '../classes/game-instance';
import { EventReadyObject } from '../DT/window';
import { ExchangeWindowSlot } from './singletons';

export class MgInjecter {
  get placeholderPartyInfo() {
    const placeholderClass = 'mirageold-party-infos';

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

  addLongTapEventOnBuyButton() {
    const wdw = this.instance.gui.sellingWindow;

    let buyerTimeout;
    const proceedToBuy = () => {
      const price = wdw.selection?.amountSoft;
      const qty = wdw.selection?.qty;
      const uid = wdw.selection?.item?.objectUID;

      if (!price || !qty || !uid) return;

      this.instance.window.dofus.connectionManager.once(
        'ExchangeBidHouseBuyResultMessage',
        () => (buyerTimeout = setTimeout(() => proceedToBuy(), 300)),
      );

      this.instance.merchant.buyItem(uid, qty, price);
    };

    wdw.on('open', () => {
      const buyBtn = wdw.buySoftBtn;

      buyBtn.addListener('longtap', () => {
        proceedToBuy();
        buyBtn.once('dom.touchend', () => clearTimeout(buyerTimeout));
      });

      const listener =
        buyBtn._events.longtap.slice?.(-1)?.[0] || buyBtn._events.longtap;
      wdw.once('close', () => buyBtn.removeListener('longtap', listener));
    });
  }

  /** Adds a "-1K" button to the selling window */
  addMinusOneKamaSellingButton() {
    const tradingWindow = this.instance?.gui?.sellingWindow;

    const minusOneKamaButton = new this.instance.singletons.DTButton({
      className: ['greenButton', 'mirageold-minus-one-kama'],
      text: '-1 K',
      tooltip: `Met l'objet en vente à 1 kama de moins que la quantité sélectionnée`,
    });

    minusOneKamaButton.addListener('tap', () => {
      this.instance.merchant.sellCurrentItemAtCurrentPriceForCurrentQuantity();
      minusOneKamaButton.disable();
      setTimeout(() => minusOneKamaButton.enable(), 300);
    });

    tradingWindow.addListener('open', () => {
      const sellBtn = tradingWindow?.bidHouseSellerBox?.sellBtn?.rootElement;
      sellBtn?.after?.(minusOneKamaButton.rootElement);
    });

    tradingWindow.addListener('close', () => {
      minusOneKamaButton.rootElement.remove();
    });
  }

  addRemoveAllCurrentlySellingItemsButton() {
    const sellingWindow = this.instance.gui.itemsCurrentlySellingWindow;

    const removeAllButtons = new this.instance.singletons.DTButton({
      className: [
        'buyModeBtn',
        'greenButton',
        'mirageold-remove-all-items-selling',
      ],
      text: '',
      addIcon: true,
      tooltip: 'Retirer les objets affichés de la vente',
    });

    removeAllButtons.addListener('tap', () => {
      const currentCateogry = this.instance.merchant.currentCateogry;
      this.instance.actions.openConfirmDialog(
        'Retirer les objets de la vente',
        `Retirer tous les objets en vente ${
          (currentCateogry && `dans la catégorie " ${currentCateogry} "`) || ''
        }?`,
        (response) => {
          if (!response) return;
          const rows = sellingWindow?.shopViewer?.table?.rows
            ?.getChildren?.()
            .filter((row) => row.isVisible());

          timer(0, 250)
            .pipe(take(rows.length))
            .subscribe((index) => {
              const row = rows[index];
              this.instance.window.dofus.sendMessage(
                'ExchangeObjectMoveMessage',
                {
                  objectUID: row.rowContent.objectUID,
                  quantity: -row.rowContent.quantity,
                },
              );
            });
        },
      );
    });

    sellingWindow?.addListener?.('open', () => {
      const switchBtn = sellingWindow?.switchToBuyModeBtn.rootElement;
      switchBtn?.after(removeAllButtons.rootElement);
    });

    sellingWindow.addListener('close', () => {
      removeAllButtons.rootElement.remove();
    });
  }

  addBindingsToShortcutSlots() {
    const slots = [
      ...this.instance.gui.spellsSlots,
      ...this.instance.gui.itemsSlots,
    ].map((v) => v.rootElement);

    slots.forEach((slot) => {
      const div = document.createElement('div');
      div.className = 'mirageold-shortcut-key quantity';
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
