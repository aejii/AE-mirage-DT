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
  }
}
