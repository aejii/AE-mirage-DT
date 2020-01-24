export interface GameLoginForm {
  _inputLogin: {
    rootElement: HTMLInputElement;
  };
  _inputPassword: {
    rootElement: HTMLInputElement;
  };
  _btnPlay: {
    tap: () => void;
  };
  _rememberName: {
    rootElement: HTMLDivElement;
    activate: () => void;
    deactivate: () => void;
  };

  _play: () => void;
}
