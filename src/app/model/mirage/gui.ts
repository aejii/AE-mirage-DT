import { GameInstance } from '../classes/game-instance';
import {
  CharacterDisplayConfiguration,
  CharacterDisplayEntityLookConfiguration,
} from './singletons';

export class MgGuiHandler {
  constructor(private instance: GameInstance) {}

  /** Login form displayed when the user starts the game */
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

  get accountButtonImage() {
    const char = getCharacterImage(
      this.instance,
      {
        scale: 'fitin',
        horizontalAlign: 'center',
        verticalAlign: 'top',
      },
      {
        riderOnly: true,
        direction: 4,
        animation: 'AnimArtwork',
        boneType: 'timeline/',
        skinType: 'timeline/',
      },
      128,
    );
    return char.rootElement;
  }

  get accountListImage() {
    return getCharacterImage(
      this.instance,
      {
        scale: 'fitin',
        horizontalAlign: 'center',
        verticalAlign: 'center',
      },
      {
        riderOnly: true,
        direction: 2,
        animation: 'AnimStatique',
        boneType: 'characters/',
        skinType: 'characters/',
      },
      256,
    );
  }

  get spellsSlots() {
    return this.instance.window?.gui?.shortcutBar?._panels?.spell?.slotList;
  }

  get itemsSlots() {
    return this.instance.window?.gui?.shortcutBar?._panels?.item?.slotList;
  }

  get currentPanelType() {
    return this.instance.window?.gui?.shortcutBar?._currentPanelType;
  }

  get currentSlotsPanel() {
    return this.instance.window?.gui?.shortcutBar?._panels?.[
      this.instance.gui.currentPanelType
    ];
  }

  get lastOpenedMenu() {
    return this.instance.window?.gui?.windowsContainer?._childrenList
      ?.filter?.((el) => el?.isVisible?.())
      ?.pop?.();
  }

  get chatWindow() {
    return this.instance.window?.gui?.chat;
  }

  setShortcutBindingOnSlot(index: number, key: string) {
    // Do it on all tabs (30 slots per tab)
    const targets = [index, index + 30, index + 60];

    targets.forEach((target) => {
      this.spellsSlots[target].rootElement.querySelector(
        '.mirage-shortcut-key',
      ).innerHTML = key || '';
      this.itemsSlots[target].rootElement.querySelector(
        '.mirage-shortcut-key',
      ).innerHTML = key || '';
    });
  }
}

function getCharacterImage(
  instance: GameInstance,
  displayConfig: CharacterDisplayConfiguration,
  lookConfig: CharacterDisplayEntityLookConfiguration,
  size: number,
) {
  try {
    const char = new instance.singletons.characterDisplay(displayConfig);
    char?.setLook?.(instance.character.entityLook, lookConfig);

    char.canvas.width = size;
    char.canvas.height = size;

    char._render?.();

    return char;
  } catch (error) {
    console.error(
      'An error occured during character image rendering for Mirage',
    );
    return undefined;
  }
}
