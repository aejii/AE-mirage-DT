import { GameInstance } from '../classes/game-instance';
import { EventReadyObject, GameGuiElement } from '../DT/window';

export class MgSingletons {
  private _audioManager: AudioManager;
  get audioManager(): AudioManager {
    if (!this._audioManager)
      this._audioManager = this.instance.finder.getSingleton<AudioManager>(
        'setMute',
        {
          window: false,
          proto: false,
          depth: 1,
        },
      );
    return this._audioManager;
  }

  private _activityRecorder: ActivityRecorder;
  get activityRecorder(): ActivityRecorder {
    if (!this._activityRecorder)
      this._activityRecorder = this.instance.finder.getSingleton<
        ActivityRecorder
      >('recordActivity', { window: false, proto: false });
    return this._activityRecorder;
  }

  private _dimensionsManager: DimensionsManager;
  get dimensionsManager(): DimensionsManager {
    if (!this._dimensionsManager)
      this._dimensionsManager = this.instance.finder.getSingleton<
        DimensionsManager
      >('updateScreen', { window: false, proto: false });
    return this._dimensionsManager;
  }

  private _windowManager: WindowManager;
  get windowManager(): WindowManager {
    if (!this._windowManager)
      this._windowManager = this.instance.finder.getSingleton<WindowManager>(
        'addWindow',
        { window: false, proto: false },
      );
    return this._windowManager;
  }

  private _buttonManager: new (
    configuration: ButtonManagerConfiguration,
  ) => GameGuiElement & EventReadyObject;
  get DTButton() {
    if (!this._buttonManager)
      this._buttonManager = this.instance.finder.getSingleton<any>(
        'DofusButton',
        {
          proto: true,
        },
        true,
      );
    return this._buttonManager;
  }

  private _characterDisplay: new (
    configuration: CharacterDisplayConfiguration,
  ) => CharacterDisplay;
  get characterDisplay(): new (
    configuration: CharacterDisplayConfiguration,
  ) => CharacterDisplay {
    if (!this._characterDisplay)
      this._characterDisplay = this.instance.finder.getSingleton(
        'rotateCharacter',
        {
          proto: true,
          singleton: false,
          window: false,
        },
        true,
      );
    return this._characterDisplay;
  }

  constructor(private instance: GameInstance) {}
}

interface AudioManager {
  setMute(forceValue?: boolean): void;
}

interface ActivityRecorder {
  recordActivity(): void;
}

interface DimensionsManager {
  dimensions: {
    bodyPaddingLeft: number;
    bodyPaddingRight: number;
    physicalScreenWidth: number;
    physicalScreenHeight: number;
    viewportWidth: number;
    viewportHeight: number;
    screenWidth: number;
    screenHeight: number;
    windowFullScreenWidth: number;
    windowFullScreenHeight: number;
    physicalToViewportRatio: number;
    mapWidth: number;
    mapHeight: number;
    zoom: number;
    sideBarWidth: number;
    bottomBarHeight: number;
    mainControlBarSize: number;
    pingEmoteBtnSize: number;
    posMainControlBar: number;
    menuBarSize: number;
    shortcutBarSize: number;
    posShortcutBar: number;
    posMenuBar: number;
    posChatBtn: number;
    posPingEmoteBtn: number;
    mapLeft: number;
    mapTop: number;
    mapRight: number;
    mapBottom: number;
    screenExceptToolbar: {
      left: number;
      top: number;
      width: number;
      height: number;
    };
  };
  updateScreen(): void;
  resizeWideScreen(menuBarSizeInFight: boolean): void;
  resizeNarrowScreen(menuBarSizeInFight: boolean): void;
}

interface WindowManager {
  addWindow(): unknown;
  getWindow(id: 'tradeWithPlayer'): EventReadyObject & ExchangeWindowInterface;
  getWindow(id: 'tradeItem'): EventReadyObject & SellingItemWindow;
  getWindow(id: 'tradeStorage'): EventReadyObject & TradeStorageWindow;
  getWindow(
    id: 'padlock',
  ): EventReadyObject & PadlockWindow & GameGuiElement<HTMLElement>;
  getWindow(id: WindowManagerIds): EventReadyObject;
}

export interface CharacterDisplayConfiguration {
  scale: number | 'fitin' | 'cover' | 'width' | 'height' | '%';
  horizontalAlign: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'center' | 'bottom';
}

export interface CharacterDisplay {
  rootElement: HTMLDivElement;
  canvas: {
    width: number;
    height: number;
    rootElement: HTMLCanvasElement;
  };
  setLook: (
    entityLook: CharacterDisplayEntityLook,
    configuration: CharacterDisplayEntityLookConfiguration,
  ) => CharacterDisplay;
  _render: () => void;
  resize: () => void;
}

export interface CharacterDisplayConfiguration {
  scale: number | 'fitin' | 'cover' | 'width' | 'height' | '%';
  horizontalAlign: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'center' | 'bottom';
}

export interface CharacterDisplayEntityLook {
  displayType: 'characters' | 'timeline';
  direction: number;
}

export interface CharacterDisplayEntityLookConfiguration {
  riderOnly: boolean;
  direction: number;
  animation?: 'AnimArtwork' | 'AnimStatique';
  boneType: 'characters/' | 'timeline/';
  skinType: 'characters/' | 'timeline/';
}

export type WindowManagerIds =
  | 'adminConsole'
  | 'allianceCard'
  | 'arena'
  | 'bidHouseShop'
  | 'birthdayLimit'
  | 'breedDetail'
  | 'breeding'
  | 'buyHardCurrencyConfirm'
  | 'cancel'
  | 'characterCreation'
  | 'characteristics'
  | 'characterSelection'
  | 'characUpdate'
  | 'cleanAssets'
  | 'confirm'
  | 'connectionQueue'
  | 'crafter'
  | 'craftersList'
  | 'crafting'
  | 'craftingMulti'
  | 'craftInventory'
  | 'craftMagus'
  | 'craftMagusMulti'
  | 'craftPayment'
  | 'deleteCharacterConfirm'
  | 'document'
  | 'equipment'
  | 'estateForSale'
  | 'estateInformation'
  | 'exchangeInventory'
  | 'exchangeStorage'
  | 'familyTree'
  | 'feed'
  | 'fightEnd'
  | 'fightEndRewards'
  | 'fightList'
  | 'giftSelection'
  | 'global'
  | 'grimoire'
  | 'guildCard'
  | 'guildHouseInfo'
  | 'guildHouseSetting'
  | 'guildMemberRights'
  | 'hardcoreDeath'
  | 'help'
  | 'houseBuySell'
  | 'itemAppearance'
  | 'itemBox'
  | 'itemManage'
  | 'itemPicking'
  | 'itemRecipes'
  | 'itemSets'
  | 'jobOptions'
  | 'legalAgreement'
  | 'levelUp'
  | 'market'
  | 'marketingWindow'
  | 'mimicry'
  | 'mount'
  | 'mountRename'
  | 'nickname'
  | 'options'
  | 'paddockBuy'
  | 'padlock'
  | 'partyInviteDetails'
  | 'popup'
  | 'preloadMap'
  | 'presetChooseIcon'
  | 'prismVulnerabilityDate'
  | 'PromotionPopupWindow'
  | 'purchasesPending'
  | 'ratingWindow'
  | 'recaptcha'
  | 'register'
  | 'rewardsPending'
  | 'serverDetails'
  | 'serverListSelection'
  | 'serverSelection'
  | 'serverSimpleSelection'
  | 'ShieldSelectionWindow'
  | 'shieldWindow'
  | 'shopConfirm'
  | 'social'
  | 'socialGroupCreation'
  | 'spellForget'
  | 'teleporterList'
  | 'toa'
  | 'toaRetryPopup'
  | 'tradeInventory'
  | 'tradeItem'
  | 'tradeItemConfirm'
  | 'tradeMode'
  | 'tradeStorage'
  | 'tradeWithNPC'
  | 'tradeWithPlayer'
  | 'tradeWithPlayerAndNPCInventory'
  | 'wallet'
  | 'worldMap';

export interface ExchangeWindowInterface {
  _myTradeSpace: {
    _allSlots: {
      _childrenMap: {
        [key: number]: ExchangeWindowSlot;
      };
    };
  };
}

export interface ExchangeWindowSlot extends EventReadyObject {
  itemInstance: GameItem;
  getQuantity(): number;
}

export interface PadlockWindow {
  confirmButton: GameGuiElement;
  enterCode(input: number): void;
  resetCode(): void;
}

export interface SellingItemWindow {
  mode: 'sell-bidHouse' | 'modify-bidHouse';
  buySoftBtn: GameGuiElement & EventReadyObject;
  selection: {
    qty: number;
    amountSoft: number;
    item: GameItem;
  };
  bidHouseSellerBox: {
    sellBtn: GameGuiElement<HTMLDivElement>;
    quantity: number;
    quantitySelect: EventReadyObject &
      GameGuiElement & {
        setValue(quantity: number): void;
      };
    item: GameItem;
    price: number;
    fees: number;
    minPricesCache: {
      [key: number]: [number, number, number];
    };
    priceInput: {
      setValue(number): void;
    };
  };
  sellInBidHouse(item, price, quantity, fees): void;
}

export interface ButtonManagerConfiguration {
  className?: string | string[];
  text?: string;
  addIcon?: boolean;
  tooltip?: string;
}

export interface TradeStorageWindow {
  switchToBuyModeBtn: GameGuiElement;
  shopViewer: {
    itemFilter: {
      _selectedFilter: number;
      _selectedSubFilter: number;
      _selectList: {
        wdSelect: {
          _valuePairs: {
            text: string;
            value: number;
          }[];
        };
      }[];
    };
    table: {
      rows: {
        getChildren(): (EventReadyObject &
          GameGuiElement & {
            rowContent: GameItem;
          })[];
      };
    };
  };
}

export interface GameItem {
  objectUID: number;
  objectGID: number;
  quantity: number;
}
