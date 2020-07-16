import { GameInstance } from '../classes/game-instance';

export class MgSingletons {
  private _audioManager: AudioManager;
  get audioManager(): AudioManager {
    if (!this._audioManager)
      this._audioManager = this.instance.finder.findSingletonForKey<
        AudioManager
      >('setMute');
    return this._audioManager;
  }

  private _activityRecorder: ActivityRecorder;
  get activityRecorder(): ActivityRecorder {
    if (!this._activityRecorder)
      this._activityRecorder = this.instance.finder.findSingletonForKey<
        ActivityRecorder
      >('recordActivity');
    return this._activityRecorder;
  }

  private _dimensionsManager: DimensionsManager;
  get dimensionsManager(): DimensionsManager {
    if (!this._dimensionsManager)
      this._dimensionsManager = this.instance.finder.findSingletonForKey<
        DimensionsManager
      >('updateScreen');
    return this._dimensionsManager;
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
