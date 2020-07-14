import { Injectable } from '@angular/core';
import { GameInstance } from '@model';
import { map } from 'rxjs/operators';
import { GameMenuBarIconsNames } from 'src/app/model/DT/window';
import { InstancesService } from '../instances/instances.service';
import { KeyboardShortcutsQuery } from './keyboard-shortcuts.query';
import {
  KeyboardShortcutsStore,
  MgKeyboardShortcut,
} from './keyboard-shortcuts.store';

@Injectable({
  providedIn: 'root',
})
export class KeyboardShortcutsService {
  slotShortcuts$ = this.query
    .selectAll()
    .pipe(
      map((shortcuts) =>
        shortcuts
          .filter(
            (shortcut) =>
              shortcut.target === 'slot' && !!shortcut.code && !!shortcut.name,
          )
          .sort((a, b) => a.slotIndex - b.slotIndex),
      ),
    );

  menuShortcuts$ = this.query
    .selectAll()
    .pipe(
      map((shortcuts) =>
        shortcuts
          .filter(
            (shortcut) =>
              !!shortcut.code &&
              !!shortcut.name &&
              shortcut.target !== 'slot' &&
              shortcut.target !== 'previous instance' &&
              shortcut.target !== 'next instance' &&
              shortcut.target !== 'skip turn / ready',
          )
          .sort((a, b) => a.target.localeCompare(b.target)),
      ),
    );

  uiShortcuts$ = this.query
    .selectAll()
    .pipe(
      map((shortcuts) =>
        shortcuts
          .filter(
            (shortcut) =>
              !!shortcut.code &&
              !!shortcut.name &&
              (shortcut.target === 'previous instance' ||
                shortcut.target === 'next instance' ||
                shortcut.target === 'skip turn / ready'),
          )
          .sort((a, b) => a.target.localeCompare(b.target)),
      ),
    );

  unusedShortcuts$ = this.query
    .selectAll()
    .pipe(
      map((shortcuts) =>
        shortcuts.filter((shortcut) => !shortcut.name && !shortcut.code),
      ),
    );

  constructor(
    private query: KeyboardShortcutsQuery,
    private store: KeyboardShortcutsStore,
    private instances: InstancesService,
  ) {}

  updateShortcut(
    shortcut: MgKeyboardShortcut,
    event: { code: string; key: string },
  ) {
    this.store.update(shortcut.id, {
      ...shortcut,
      code: event.code,
      name: event.key,
    });
  }

  runShortcut(instance: GameInstance, event: KeyboardEvent) {
    const shallContinue = this._runSpecialShortcut(instance, event);
    if (!shallContinue) return;

    const shortcut = this._getShortcut(event);

    if (!shortcut || !instance) return;
    else if (shortcut.target === 'slot') {
      instance.shortcuts.useSlotInCurrentPanel(shortcut.slotIndex);
    } else if (shortcut.target === 'next instance') {
      this.instances.nextInstance();
    } else if (shortcut.target === 'previous instance') {
      this.instances.previousInstance();
    } else if (shortcut.target === 'skip turn / ready') {
      instance.shortcuts.clikOnReadyButton();
    } else {
      instance.shortcuts.clickOnMenuIcon(
        shortcut?.target as GameMenuBarIconsNames,
      );
    }
  }

  private _getShortcut(event: KeyboardEvent) {
    return this.query.getAll().find((shortcut) => shortcut.code === event.code);
  }

  /**
   * Checks if the provided keyboard event matches specific shortcuts :
   * - Enter key should open the chat
   * - Ctrl + W should close an account (and not the window)
   * - Escape key should close in-game windows, and if none, open the settings
   * @returns a boolean stating if a special shortcut has been ran : if true, the shortcut must be processed.
   */
  private _runSpecialShortcut(
    instance: GameInstance,
    event: KeyboardEvent,
  ): boolean {
    if (event.key === 'Escape' && event.code === 'Escape') {
      // since chat is a top-window, always close it (if it's already closed, no effect)
      instance.gui.toggleChat(false);
      // Close the last opened window
      const lastOpenedMenu = instance.gui.lastOpenedMenu;
      if (lastOpenedMenu) lastOpenedMenu.close?.();
      else instance.shortcuts.showSettings();
      return false;
    } else if (event.key === 'Enter' && event.code === 'Enter') {
      instance.gui.toggleChat(true);
      return false;
    } else if (event.key === 'w' && event.ctrlKey) {
      this.instances.removeInstance(instance);
    }
    return true;
  }
}
