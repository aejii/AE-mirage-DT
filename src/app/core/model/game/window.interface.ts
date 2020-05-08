import { GameLoginForm } from './login-form.interface';

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
   */
  singletons(ref: number): any;
}

interface Undiscorvered {
  [key: string]: any;
}
