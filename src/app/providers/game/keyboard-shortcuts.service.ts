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
}
