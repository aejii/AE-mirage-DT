export interface DTWindow extends Window {
  dofus: {
    connectionManager: {
      sendMessage: (verb: string, payload: any) => any;
      on: (verb: string, callback: (...args) => any) => any;
    };
  };
  gui: {
    mainControls: {
      buttonBox: GameGuiElement;
    };
    windowsContainer: {
      _childrenList: (GameGuiElement & {
        isVisible(): boolean;
        close(): void;
      })[];
    };
    chat: {
      active: boolean;
      activate(): void;
      deactivate(): void;
    };
    timeline: {
      fightControlButtons: {
        _turnReadyBtn: GameGuiElement;
        _fightReadyBtn: GameGuiElement;
      };
    };
    menuBar: {
      _icons: GameGuiElement & {
        _childrenMap: {
          [key in GameMenuBarIconsNames]: GameGuiElement;
        };
      };
    };
    _resizeUi: () => void;
    notificationBar: { removeNotification: (id: string) => void };
    fightManager: {
      fightState: -1 | 0 | 1; // Unknown | In preparation | Fighting
      _fighters: { [key: number]: FightManagerFighter };
    };
    shortcutBar: {
      _currentPanelType: 'spell' | 'item';
      _panels: {
        [key in 'spell' | 'item']: {
          slotList: (EventReadyObject &
            GameGuiElement & { data: { id: number } })[];
        };
      };
    };
    shopFloatingToolbar: {
      hide: () => void;
      show: () => void;
    };
    loginScreen: {
      showLoginForm: () => void;
      _loginForm: {
        _inputLogin: GameGuiElement<HTMLInputElement>;
        _inputPassword: GameGuiElement<HTMLInputElement>;
        _rememberName: {
          rootElement: HTMLElement;
          acitvate: () => void;
          deactivate: () => void;
        };
        _btnPlay: {
          tap: () => void;
        };
        _play: () => void;
      };
    };
    on: (verb: string, callback: (...args: any) => any) => any;
    playerData: {
      id: number;
      isFighting: boolean;
      characterBaseInformations: {
        name: string;
        level: string;
        entityLook: any;
      };
      characters: {
        mainCharacter: {
          characteristics: {
            prospecting: {
              getTotalStat: () => number;
            };
          };
        };
      };
    };
    party: {
      collapse: () => void;
      currentParty: {
        _childrenList: { memberData: PartyMemberData }[];
      };
      classicParty: GameGuiElement;
    };
  };

  foreground: {
    selectSpell: (id: number) => void;
  };

  isoEngine: {
    _castSpellImmediately: (id: number) => void;
    mapScene: {
      camera: {
        maxZoom: number;
      };
    };
  };

  singletons: ((index: number) => any) & {
    c: { [key: number]: any };
  };
}

export interface EventReadyObject {
  _events: { [key: string]: any };
  addListener: (verb: string, callback: (...args) => any) => any;
  removeListener: (verb: string, event: any) => void;
  emit: (verb: string) => any;
}

export interface FightManagerFighter {
  data: {
    disposition: {
      cellId: number;
    };
  };
}

export type GameMenuBarIconsNames =
  | 'Carac'
  | 'Spell'
  | 'Bag'
  | 'BidHouse'
  | 'Map'
  | 'Friend'
  | 'Book'
  | 'Guild'
  | 'Conquest'
  | 'Goultine'
  | 'Job'
  | 'Alliance'
  | 'Mount'
  | 'Directory'
  | 'Alignment'
  | 'Bestiary'
  | 'Title'
  | 'Achievement'
  | 'Almanax'
  | 'Spouse'
  | 'Shop'
  | 'TOA'
  | 'Help';

export interface PartyMemberData {
  id: number;
  level: number;
  name: string;
  entityLook: unknown;
  breed: number;
  sex: boolean;
  lifePoints: number;
  maxLifePoints: number;
  prospecting: number;
  regenRate: number;
  initiative: number;
  alignmentSide: number;
  worldX: number;
  worldY: number;
  mapId: number;
  subAreaId: number;
  status: unknown;
}

export interface GameGuiElement<T = HTMLElement> {
  rootElement: T;
  _childrenList: GameGuiElement[];
  _childrenMap: { [key: string]: GameGuiElement };
  tap(): void;
  show(): void;
}
