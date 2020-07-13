import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { KeyboardShortcutsService, MgKeyboardShortcut } from '@providers';
import { fromEvent, Subscription } from 'rxjs';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'mg-keyboard-bindings',
  templateUrl: './keyboard-bindings.component.html',
  styleUrls: ['./keyboard-bindings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyboardBindingsComponent implements OnInit, OnDestroy {
  awaitingbinding: MgKeyboardShortcut;
  windowBindingListener: Subscription;

  constructor(
    public shortcuts: KeyboardShortcutsService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {}

  setNewBinding(shortcut: MgKeyboardShortcut) {
    this.awaitingbinding = shortcut;
    this.windowBindingListener = fromEvent<KeyboardEvent>(window, 'keyup')
      .pipe(
        filter(() => !!this.awaitingbinding),
        first(),
      )
      .subscribe((event) => {
        this.shortcuts.updateShortcut(shortcut, event);
        this.awaitingbinding = undefined;
        this.cdRef.detectChanges();
      });
  }

  removeShortcut(shortcut: MgKeyboardShortcut) {
    this.shortcuts.updateShortcut(shortcut, {
      key: undefined,
      code: undefined,
    });
  }

  ngOnDestroy() {
    this.windowBindingListener?.unsubscribe?.();
  }
}
