import { GameInstance } from '../classes/game-instance';

export class MgMerchant {
  private quantities = [1, 10, 100];

  /**
   * Window with the price, quantity, fees, etc
   */
  get sellingSettingsWindow() {
    return this.instance?.gui?.sellingWindow?.bidHouseSellerBox;
  }

  get currentItemPrice() {
    const price = this.sellingSettingsWindow?.minPricesCache?.[
      this.sellingSettingsWindow?.item?.objectGID
    ]?.[this.quantities.indexOf(this.currentSellingQuantity)];

    return price ?? 1;
  }

  get currentSellingQuantity() {
    const quantity = this.sellingSettingsWindow?.quantity;
    return quantity ?? 0;
  }

  get itemToSellQuantity() {
    return this.sellingSettingsWindow?.item?.quantity ?? 0;
  }

  get currentCateogry() {
    const window = this.instance.gui.itemsCurrentlySellingWindow;
    const currentFilter = window?.shopViewer?.itemFilter?._selectedFilter;
    const currentSubfilter = window?.shopViewer?.itemFilter?._selectedSubFilter;
    if (currentSubfilter === -1) return undefined; // All items
    const selectedPair = window?.shopViewer?.itemFilter?._selectList?.[
      currentFilter
    ]?.wdSelect?._valuePairs?.find?.(
      (pair) =>
        pair?.value === window?.shopViewer?.itemFilter?._selectedSubFilter,
    );
    return selectedPair?.text;
  }

  constructor(private instance: GameInstance) {}

  /**
   * Sells the selected item at the given price minus 1, for the selected quantity
   */
  sellCurrentItemAtCurrentPriceForCurrentQuantity() {
    this.instance.window.dofus.connectionManager.on(
      'ExchangeBidHouseItemAddOkMessage',
      (response) => {
        const soldQty = response.itemInfo.quantity;
        const newQty = this.itemToSellQuantity - soldQty;

        if (this.currentSellingQuantity > 1)
          while (newQty < this.currentSellingQuantity) this.changeQuantity(-1);

        this.instance.window.dofus.connectionManager.removeListener(
          'ExchangeBidHouseItemAddOkMessage',
          listener,
        );
      },
    );

    const listener = this.instance.window.dofus.connectionManager.eventHandlers.ExchangeBidHouseItemAddOkMessage.slice(
      -1,
    )[0];

    this.instance.window.dofus.sendMessage('ExchangeObjectMovePricedMessage', {
      objectUID: this.sellingSettingsWindow?.item?.objectUID,
      quantity: this.currentSellingQuantity,
      price: this.currentItemPrice === 1 ? 1 : this.currentItemPrice - 1,
    });
  }

  private changeQuantity(indexShift: 1 | -1) {
    this.sellingSettingsWindow.quantitySelect.setValue(
      this.quantities[
        this.quantities.indexOf(this.currentSellingQuantity) + indexShift
      ],
    );
    this.sellingSettingsWindow.quantitySelect.emit(
      'change',
      this.quantities[
        this.quantities.indexOf(this.currentSellingQuantity) + indexShift
      ],
    );
  }
}
