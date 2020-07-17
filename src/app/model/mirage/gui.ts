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

  get placeholderPartyInfo() {
    const placeholderClass = 'mirage-party-infos';

    const partyEl = this.instance.window?.gui?.party?.classicParty;
    const groupLeaderEl = partyEl?._childrenList[0]?.rootElement;
    let placeholder: HTMLElement = partyEl?.rootElement?.querySelector?.(
      `.${placeholderClass} span`,
    );

    if (!partyEl || !groupLeaderEl) return undefined;
    else if (placeholder) return placeholder;
    else {
      placeholder = document.createElement('div');
      placeholder.classList.add(placeholderClass);
      placeholder.style.display = 'flex';
      placeholder.style.flexFlow = 'row';
      placeholder.style.alignItems = 'center';
      placeholder.style.justifyContent = 'center';
      const span = document.createElement('span');
      placeholder.appendChild(span);
      partyEl.rootElement.insertBefore(placeholder, groupLeaderEl);

      return span;
    }
  }

  constructor(private instance: GameInstance) {}

  removeShopButton() {
    // Timeout because on connection, might not be declared yet
    setTimeout(() => this.instance.window?.gui?.shopFloatingToolbar?.hide?.());
  }

  refreshInterface() {
    try {
      this.instance.singletons.dimensionsManager.dimensions.viewportWidth = 0;
      this.instance.singletons.dimensionsManager.dimensions.viewportHeight = 0;
      this.instance.window.isoEngine.mapScene.camera.maxZoom = 2;
      this.instance.singletons.dimensionsManager.updateScreen();
      this.instance.window?.gui?._resizeUi?.();
    } catch (e) {}
  }

  removeNotification(notificationId: string) {
    this.instance.window?.gui?.notificationBar?.removeNotification?.(
      notificationId,
    );
  }

  hidePartyDetails() {
    this.instance.window.gui?.party?.collapse?.();
  }

  addPartyInfoPlaceHolder() {
    const placeholderClass = 'mirage-party-infos';

    const partyEl = this.instance.window.gui.party.classicParty;
    const groupLeaderEl = partyEl._childrenList[0].rootElement;

    if (partyEl.rootElement.querySelector(`.${placeholderClass}`))
      return undefined;

    const placeholder = document.createElement('div');
    placeholder.classList.add(placeholderClass);

    partyEl.rootElement.insertBefore(placeholder, groupLeaderEl);
    return placeholder;
  }

  get accountButtonImage() {
    try {
      const char = new this.instance.singletons.characterDisplay({
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
      const char = new this.instance.singletons.characterDisplay({
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

  addBindingsToShortcutSlots() {
    const slots = [...this.spellsSlots, ...this.itemsSlots].map(
      (v) => v.rootElement,
    );

    slots.forEach((slot) => {
      const div = document.createElement('div');
      div.className = 'mirage-shortcut-key quantity';
      slot.appendChild(div);
    });
  }

  setShortcutBindingOnSlot(index: number, key: string) {
    this.spellsSlots[index].rootElement.querySelector(
      '.mirage-shortcut-key',
    ).innerHTML = key || '';
    this.itemsSlots[index].rootElement.querySelector(
      '.mirage-shortcut-key',
    ).innerHTML = key || '';
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

  toggleChat(forceValue?: boolean) {
    const shouldShow = forceValue ?? !this.chatWindow?.active;
    if (shouldShow) this.chatWindow?.activate?.();
    else this.chatWindow?.deactivate?.();
  }
}
