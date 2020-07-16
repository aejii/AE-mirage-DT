import { GameInstance } from '../classes/game-instance';

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
