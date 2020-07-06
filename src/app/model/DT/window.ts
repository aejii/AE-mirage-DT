export interface DTWindow extends Window {
  // TODO Remove this from the regexes and use the singleton
  mirageInactivity: {
    recordActivity: () => void;
  };
  dofus: {
    connectionManager: {
      sendMessage: (verb: string, payload: any) => any;
      on: (verb: string, callback: (...args) => any) => any;
    };
  };
  gui: {
    _resizeUi: () => void;
    notificationBar: { removeNotification: (id: string) => void };
    fightManager: {
      _fighters: { [key: number]: FightManagerFighter };
    };
    shortcutBar: {
      _panels: {
        spell: {
          slotList: (EventReadyObject & DataHoldingObject<{ id: number }>)[];
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
        _inputLogin: { rootElement: HTMLInputElement };
        _inputPassword: { rootElement: HTMLInputElement };
        _rememberName: {
          rootElement: HTMLElement,
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
        _childrenList: { memberData: unknown }[];
      };
    };
  };

  foreground: {
    selectSpell: (id: number) => void;
  };

  isoEngine: {
    _castSpellImmediately: (id: number) => void;
  };

  CharacterDisplay: new (
    configuration: CharacterDisplayConfiguration,
  ) => CharacterDisplay;
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

export interface EventReadyObject {
  addListener: (verb: string, callback: (...args) => any) => any;
  removeListener: (verb: string, event: any) => void;
  _events: { [key: string]: any };
}

export interface DataHoldingObject<T> {
  data: T;
}

export interface FightManagerFighter {
  data: {
    disposition: {
      cellId: number;
    };
  };
}