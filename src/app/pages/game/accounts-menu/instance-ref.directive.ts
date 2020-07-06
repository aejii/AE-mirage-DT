import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GameInstance } from '@model';

/**
 * Directive that emits the image / number event for the accounts menu
 */
@Directive({
  selector: '[mgInstanceRef]',
})
export class InstanceRefDirective implements OnInit {
  @Input('mgInstanceRef') instanceRef: GameInstance;

  @Output() canvasReady = new EventEmitter<HTMLDivElement>();
  @Output() logout = new EventEmitter();
  @Output() init = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.init.emit();

    this.instanceRef.events.characterLogin$.subscribe(() =>
      this.canvasReady.emit(this.instanceRef.gui.accountButtonImage),
    );

    this.instanceRef.events.characterLogout$.subscribe(() =>
      this.logout.emit(),
    );
  }
}
