import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { GameMenuBarIconsNames } from 'src/app/model/DT/window';

type nonMenuShortcutsTargets =
  | 'slot'
  | 'next instance'
  | 'previous instance'
  | 'skip turn / ready';
type ShortcutsKeyCodes = GameMenuBarIconsNames | nonMenuShortcutsTargets;

export interface MgKeyboardShortcut {
  id: string;
  target: ShortcutsKeyCodes;
  slotIndex?: number;
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
  constructor() {
    super();
    if (!this.getValue().ids.length) this.set(defaultShortcuts);
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
  createEmptyShortcut('Book'),
  createEmptyShortcut('Conquest'),
  createEmptyShortcut('Directory'),
  createEmptyShortcut('Goultine'),
  createEmptyShortcut('Help'),
  createEmptyShortcut('Shop'),
  createEmptyShortcut('Spouse'),
  createEmptyShortcut('TOA'),
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
    slotIndex,
    name,
    code,
  };
}

function createEmptyShortcut(
  target: ShortcutsKeyCodes,
  slotIndex?: number,
): MgKeyboardShortcut {
  return {
    id: target + (slotIndex || ''),
    target,
    slotIndex,
    code: undefined,
    name: undefined,
  };
}
