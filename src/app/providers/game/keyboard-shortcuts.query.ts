import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
  KeyboardShortcutsState,
  KeyboardShortcutsStore,
} from './keyboard-shortcuts.store';

@Injectable({ providedIn: 'root' })
export class KeyboardShortcutsQuery extends QueryEntity<
  KeyboardShortcutsState
> {
  constructor(protected store: KeyboardShortcutsStore) {
    super(store);
    // On start, add new default shortcuts to user-saved ones. This way, new shortcuts get added to the list when they're created.
    const stored = this.getAll();
    const def = this.store.defaultShortcuts;
    const final = stored.concat(
      def.filter((shortcut) => !stored.some((sc) => sc.id === shortcut.id)),
    );
    this.store.set(final);
  }
}
