import { Directive, Input, HostBinding, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { MgButtonBase } from './button.base';

@Directive({
  selector: '[mg-toggle-button]'
})
export class ToggleButtonDirective extends MgButtonBase implements OnChanges {
  // tslint:disable-next-line: no-input-rename
  @Input('mg-toggle-button') selectorInverter = false;

  @HostBinding('class.mg-toggle-button')
  get mgIconButton() {
    return !this.selectorInverter;
  }

  @HostBinding('class.mg-toggle-active')
  @Input() active = false;

  constructor(protected el: ElementRef<HTMLButtonElement>) {
    super(el);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.active = changes.active?.currentValue ?? !this.active;
  }

  onClick() {
    // this.active = !this.active;
  }
}