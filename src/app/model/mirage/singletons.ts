import { GameInstance } from '../classes/game-instance';

export class MgSingletons {
  private _audioManager: AudioManager;
  get audioManager(): AudioManager {
    if (!this._audioManager)
      this._audioManager = this.instance.finder.findSingletonForKey('setMute');
    return this._audioManager;
  }

  private _activityRecorder: ActivityRecorder;
  get activityRecorder(): ActivityRecorder {
    if (!this._activityRecorder)
      this._activityRecorder = this.instance.finder.findSingletonForKey(
        'recordActivity',
      );
    return this._activityRecorder;
  }

  constructor(private instance: GameInstance) {}
}

interface AudioManager {
  setMute(forceValue?: boolean): void;
}

interface ActivityRecorder {
  recordActivity(): void;
}
