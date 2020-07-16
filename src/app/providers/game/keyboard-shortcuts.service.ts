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
    if (!instance) return;

    const shortcut = this.query.getAll().find((s) => s.name === event.key);

    if (shortcut) this._runCustomShortcut(instance, shortcut, event);
    else this._runSystemShortcut(instance, event);
  }

  /**
   * Checks if the provided keyboard event matches specific shortcuts :
   * - Enter key should open the chat
   * - Ctrl + W should close an account (and not the window)
   * - Escape key should close in-game windows, and if none, open the settings
   */
  private _runSystemShortcut(instance: GameInstance, event: KeyboardEvent) {
    if (event.key === 'w' && event.ctrlKey) {
      event.preventDefault();
      event.stopPropagation();
      return this.instances.removeInstance(instance);
    }
    if (event.key === 'Enter' && event.code === 'Enter') {
      // Don't open if already in an input field
      if (
        // tslint:disable-next-line: no-string-literal
        event.target instanceof instance.window['HTMLInputElement'] ||
        // tslint:disable-next-line: no-string-literal
        event.target instanceof instance.window['HTMLTextAreaElement']
      )
        return;

      return instance.gui.toggleChat(true);
    }
    if (event.key === 'Escape' && event.code === 'Escape') {
      if (instance.gui.chatWindow.active) {
        instance.gui.toggleChat(false);
      } else {
        // Close the last opened window
        const lastOpenedMenu = instance.gui.lastOpenedMenu;
        if (lastOpenedMenu) lastOpenedMenu.close?.();
        // Show settings if no window opened
        else instance.shortcuts.showSettings();
      }
      return;
    }
  }

  private _runCustomShortcut(
    instance: GameInstance,
    shortcut: MgKeyboardShortcut,
    event: KeyboardEvent,
  ) {
    if (
      event.target instanceof HTMLInputElement ||
      // Because it does a prototype comparison, it must check on the iframe, not the window
      // tslint:disable-next-line: no-string-literal
      event.target instanceof instance.window['HTMLInputElement'] ||
      event.target instanceof HTMLTextAreaElement ||
      // tslint:disable-next-line: no-string-literal
      event.target instanceof instance.window['HTMLTextAreaElement']
    )
      return;

    if (shortcut.target === 'slot') {
      instance.shortcuts.useSlotInCurrentPanel(shortcut.slotIndex);
    } else if (shortcut.target === 'next instance') {
      this.instances.nextInstance();
    } else if (shortcut.target === 'previous instance') {
      this.instances.previousInstance();
    } else if (shortcut.target === 'skip turn / ready') {
      instance.shortcuts.clikOnReadyButton();
    } else {
      instance.shortcuts.clickOnMenuIcon(
        shortcut.target as GameMenuBarIconsNames,
      );
    }
  }
}
