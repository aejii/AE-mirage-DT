import { GameInstance } from '../classes/game-instance';
import { EventReadyObject } from '../DT/window';

export class MgSingletons {
  private _audioManager: AudioManager;
  get audioManager(): AudioManager {
    if (!this._audioManager)
      this._audioManager = this.instance.finder.getSingletonObjectWithKey<
        AudioManager
      >('setMute');
    return this._audioManager;
  }

  private _activityRecorder: ActivityRecorder;
  get activityRecorder(): ActivityRecorder {
    if (!this._activityRecorder)
      this._activityRecorder = this.instance.finder.getSingletonObjectWithKey<
        ActivityRecorder
      >('recordActivity');
    return this._activityRecorder;
  }

  private _dimensionsManager: DimensionsManager;
  get dimensionsManager(): DimensionsManager {
    if (!this._dimensionsManager)
      this._dimensionsManager = this.instance.finder.getSingletonObjectWithKey<
        DimensionsManager
      >('updateScreen');
    return this._dimensionsManager;
  }

  private _windowManager: WindowManager;
  get windowManager(): WindowManager {
    if (!this._windowManager)
      this._windowManager = this.instance.finder.getSingletonObjectWithKey<
        WindowManager
      >('addWindow');
    return this._windowManager;
  }

  private _characterDisplay: new (
    configuration: CharacterDisplayConfiguration,
  ) => CharacterDisplay;
  get characterDisplay(): new (
    configuration: CharacterDisplayConfiguration,
  ) => CharacterDisplay {
    if (!this._characterDisplay)
      this._characterDisplay = this.instance.finder.getSingletonConstructorWithKey(
        'rotateCharacter',
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
  itemInstance: {
    objectUID: number;
  };
  getQuantity(): number;
}
