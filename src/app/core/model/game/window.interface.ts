import { GameLoginForm } from './login-form.interface';
import { SingletonAudioManager } from './singletons-interfaces/audio-manager.singleton';
import { SingletonScreenMeasurement } from './singletons-interfaces/screen-measurement.singleton';

export interface GameWindow extends Window, Undiscorvered {
  gui: {
    loginScreen: {
      _loginForm: GameLoginForm;
    };
    on: (verb: string, callback: (...args: any) => any) => any;
  } & Undiscorvered;

  // Set by regexes
  mirageInactivity: {
    recordActivity: () => void;
  };

  dofus: {
    connectionManager: {
      sendMessage: (verb: string, payload: any) => any;
      on: (verb: string, cb: (...args) => void) => any;
    };
  };

  /**
   * Definition of singletons bound to the window.singletons object.
   * This is set by a script file regex and allows to get memory references of uglified code.
   * No more scouting into nested objects !
   */
  singletons(ref: number): any;
  singletons(ref: 179): SingletonScreenMeasurement;
  singletons(ref: 254): SingletonAudioManager;
}

interface Undiscorvered {
  [key: string]: any;
}
