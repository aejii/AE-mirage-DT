import { GameInstance } from '../classes/game-instance';

export class MgGuiHandler {
  get loginForm() {
    return {
      username: this.instance.window.gui?.loginScreen?._loginForm?._inputLogin
        ?.rootElement,
      password: this.instance.window.gui?.loginScreen?._loginForm
        ?._inputPassword?.rootElement,
      rememberName: this.instance.window.gui?.loginScreen?._loginForm
        ?._rememberName,
      show: () => this.instance.window.gui?.loginScreen?.showLoginForm?.(),
      play: () => this.instance.window.gui?.loginScreen?._loginForm?._play?.(),
    };
  }

  constructor(private instance: GameInstance) {}

  removeShopButton() {
    // Timeout because on connection, might not be declared yet
    setTimeout(() => this.instance.window?.gui?.shopFloatingToolbar?.hide?.());
  }

  refreshInterface() {
    this.instance.window?.gui?._resizeUi?.();
  }

  removeNotification(notificationId: string) {
    this.instance.window?.gui?.notificationBar?.removeNotification?.(
      notificationId,
    );
  }

  hidePartyDetails() {
    this.instance.window.gui?.party?.collapse?.();
  }

  get accountButtonImage() {
    try {
      const char = new this.instance.window.CharacterDisplay({
        scale: 'fitin',
        horizontalAlign: 'center',
        verticalAlign: 'top',
      });
      char?.setLook?.(this.instance.character.entityLook, {
        riderOnly: true,
        direction: 4,
        animation: 'AnimArtwork',
        boneType: 'timeline/',
        skinType: 'timeline/',
      });

      char.canvas.width = 128;
      char.canvas.height = 128;

      char._render?.();

      return char.rootElement;
    } catch (error) {
      console.error(
        'An error occured during character image rendering for Mirage',
      );
      return undefined;
    }
  }

  get accountListImage() {
    try {
      const char = new this.instance.window.CharacterDisplay({
        scale: 'fitin',
        horizontalAlign: 'center',
        verticalAlign: 'center',
      });
      char?.setLook?.(this.instance.character.entityLook, {
        riderOnly: true,
        direction: 2,
        animation: 'AnimStatique',
        boneType: 'characters/',
        skinType: 'characters/',
      });

      char.canvas.width = 256;
      char.canvas.height = 256;

      char._render?.();

      return char;
    } catch (error) {
      console.error(
        'An error occured during character image rendering for Mirage',
      );
      return undefined;
    }
  }

  get spellsSlots() {
    return this.instance.window?.gui?.shortcutBar?._panels?.spell?.slotList;
  }
}
