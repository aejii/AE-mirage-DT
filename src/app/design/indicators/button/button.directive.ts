import { Directive, ElementRef, HostBinding, Input } from '@angular/core';
import { MgButtonBase } from './button.base';

@Directive({
  selector: '[mg-button]',
})
export class ButtonDirective extends MgButtonBase {
  // tslint:disable-next-line: no-input-rename
  @Input('mg-icon-button') selectorInverter = false;

  @HostBinding('class.mg-button')
  get mgIconButton() {
    return !this.selectorInverter;
  }

  constructor(protected el: ElementRef<HTMLButtonElement>) {
    super(el);
  }
}
