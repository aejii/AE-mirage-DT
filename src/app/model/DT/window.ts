export interface DTWindow extends Window {
  dofus: {
    connectionManager: {
      sendMessage(verb: string, payload: any): any;
      on(verb: string, callback: (...args) => any): any;
    };
  };
  gui: {
    numberInputPad: GameGuiElement & {
      _doDigit(digit: number): void;
      _doEnter(): void;
      _doBackspace(): void;
    };
    mainControls: {
      buttonBox: GameGuiElement;
    };
    windowsContainer: GameGuiElement;
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
    notificationBar: { removeNotification(id: string): void };
    fightManager: {
      fightState: -1 | 0 | 1; // Unknown | In preparation | Fighting
      _fighters: { [key: number]: FightManagerFighter };
    };
    shortcutBar: {
      _currentPanelType: 'spell' | 'item';
      _panels: {
        [key in 'spell' | 'item']: EventReadyObject & {
          slotList: (EventReadyObject &
            GameGuiElement & { data: { id: number } })[];
          index: number;
        };
      };
    };
    shopFloatingToolbar: {
      hide(): void;
      show(): void;
    };
    loginScreen: {
      _loginForm: {
        _inputLogin: GameGuiElement<HTMLInputElement>;
        _inputPassword: GameGuiElement<HTMLInputElement>;
        _rememberName: {
          rootElement: HTMLElement;
          activate(): void;
          deactivate(): void;
        };
        _btnPlay: {
          tap(): void;
        };
        _play(): void;
      };
      showLoginForm(): void;
    };
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
      currentParty: {
        _childrenList: { memberData: PartyMemberData }[];
      };
      classicParty: GameGuiElement;
      collapse(): void;
    };
    on(verb: string, callback: (...args: any) => any): any;
  };

  foreground: {
    selectSpell(id: number): void;
  };

  isoEngine: {
    mapScene: {
      camera: {
        maxZoom: number;
      };
    };
    _castSpellImmediately(id: number): void;
  };

  singletons: ((index: number) => any) & {
    c: { [key: number]: any };
  };
}

export interface EventReadyObject {
  _events: { [key: string]: any };
  addListener(verb: string, callback: (...args) => any): any;
  removeListener(verb: string, event: any): void;
  emit(verb: string): any;
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
  isVisible(): boolean;
  hide(): void;
  close(): void;
}
