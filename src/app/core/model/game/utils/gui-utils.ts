import { interval } from 'rxjs';
import { GameLoginForm } from '../login-form.interface';
import { GameWindow } from '../window.interface';

export const gameGuiUtils = {
  getSpellsShortcutSlots,
  getLoginForm,
  getCharacterImage,
  refreshGui,
  removeShopButton,
  removeNotification,
  collapsePartyElement,
};

function getSpellsShortcutSlots(window: GameWindow): any[] {
  return window?.gui?.shortcutBar?._panels?.spell?.slotList;
}

function getLoginForm(window: GameWindow): GameLoginForm {
  return window?.gui?.loginScreen?._loginForm;
}

function refreshGui(window: GameWindow) {
  window?.gui?._resizeUi?.();
}

function removeShopButton(window: GameWindow) {
  // Make it run after the original command with a timeout
  setTimeout(() => window?.gui?.shopFloatingToolbar?.hide?.());
}

function removeNotification(window: GameWindow, notificationId: string) {
  window?.gui?.notificationBar?.removeNotification?.(notificationId);
}

function getCharacterImage(window: GameWindow): HTMLCanvasElement {
  if (!window) return;
  const char = new window.CharacterDisplay({ scale: 'fitin' });
  char?.setLook?.(
    window?.gui?.playerData?.characterBaseInformations?.entityLook,
    {
      riderOnly: true,
      direction: 4,
      animation: 'AnimArtwork',
      boneType: 'timeline/',
      skinType: 'timeline/',
    },
  );

  if (!char) return;

  char.horizontalAlign = 'center';
  char.verticalAlign = 'top';

  const canvas = char.canvas;
  const canvasEl: HTMLCanvasElement = char.rootElement;

  canvas.width = 128;
  canvas.height = 128;

  char._render?.();

  return canvasEl;
}

function collapsePartyElement(window: GameWindow) {
  window?.gui?.party?.collapse?.();
}