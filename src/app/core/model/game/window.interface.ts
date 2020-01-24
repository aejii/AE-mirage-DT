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
    recordActivity: () => void
  }
}

interface Undiscorvered {
  [key: string]: any;
}
