import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { GameMenuBarIconsNames } from 'src/app/model/DT/window';

export type uiShortcutsTargets =
  | 'slot'
  | 'instance'
  | 'ping'
  | 'next instance'
  | 'previous instance'
  | 'skip turn / ready';

export type ShortcutsKeyCodes = GameMenuBarIconsNames | uiShortcutsTargets;

export interface MgKeyboardShortcut {
  id: string;
  target: ShortcutsKeyCodes;
  listIndex?: number;
  code?: string;
  name?: string;
}

export interface KeyboardShortcutsState
  extends EntityState<MgKeyboardShortcut> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'keyboard-shortcuts' })
export class KeyboardShortcutsStore extends EntityStore<
  KeyboardShortcutsState
> {
  defaultShortcuts = defaultShortcuts;

  constructor() {
    super();
  }
}

const defaultShortcuts: MgKeyboardShortcut[] = [
  {
    target: 'previous instance',
    id: 'previousInstance',
    code: 'F1',
    name: 'F1',
  },
  { target: 'next instance', id: 'nextInstance', code: 'F2', name: 'F2' },
  {
    target: 'skip turn / ready',
    id: 'skipTurnOrReady',
    code: 'Space',
    name: ' ',
  },
  {
    id: 'ping',
    target: 'ping',
    code: 'Backquote',
    name: '²',
  },

  createMenuShortcut('Achievement', 'u'),
  createMenuShortcut('Alliance', 'a'),
  createMenuShortcut('Almanax', 'x'),
  createMenuShortcut('Bag', 'i'),
  createMenuShortcut('Bestiary', 'b'),
  createMenuShortcut('Book', 'q'),
  createMenuShortcut('BidHouse', 'k'),
  createMenuShortcut('Carac', 'c'),
  createMenuShortcut('Friend', 'f'),
  createMenuShortcut('Guild', 'g'),
  createMenuShortcut('Job', 'j'),
  createMenuShortcut('Map', 'm'),
  createMenuShortcut('Mount', 'd'),
  createMenuShortcut('Spell', 's'),
  createMenuShortcut('Title', 't'),
  createSlotShortcut('&', 'Digit1', 0),
  createSlotShortcut('é', 'Digit2', 1),
  createSlotShortcut('"', 'Digit3', 2),
  createSlotShortcut(`'`, 'Digit4', 3),
  createSlotShortcut('(', 'Digit5', 4),
  createSlotShortcut('-', 'Digit6', 5),
  createSlotShortcut('è', 'Digit7', 6),
  createSlotShortcut('_', 'Digit8', 7),
  createSlotShortcut('ç', 'Digit9', 8),
  createSlotShortcut('à', 'Digit0', 9),
  // Create unbound shortcuts for remaining item/spell slots
  ...new Array(20).fill(0).map((_, i) => createEmptyShortcut('slot', i + 10)),
  createEmptyShortcut('Alignment'),
  createEmptyShortcut('Conquest'),
  createEmptyShortcut('Directory'),
  createEmptyShortcut('Goultine'),
  createEmptyShortcut('Help'),
  createEmptyShortcut('Shop'),
  createEmptyShortcut('Spouse'),
  createEmptyShortcut('TOA'),
  // Create unbound shortcuts to select a given instance
  ...new Array(12).fill(0).map((_, i) => createEmptyShortcut('instance', i)),
];

function createMenuShortcut(
  target: GameMenuBarIconsNames,
  letter: string,
): MgKeyboardShortcut {
  return {
    id: target,
    target,
    name: letter.toLowerCase(),
    code: 'Key' + letter.toUpperCase(),
  };
}

function createSlotShortcut(
  name: string,
  code: string,
  slotIndex: number,
): MgKeyboardShortcut {
  return {
    id: 'slot' + slotIndex,
    target: 'slot',
    listIndex: slotIndex,
    name,
    code,
  };
}

function createEmptyShortcut(
  target: ShortcutsKeyCodes,
  listIndex?: number,
): MgKeyboardShortcut {
  return {
    id: target + (listIndex || ''),
    target,
    listIndex,
    code: undefined,
    name: undefined,
  };
}
