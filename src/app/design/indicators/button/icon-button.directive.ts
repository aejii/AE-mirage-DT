import { Directive, ElementRef, HostBinding, Input } from '@angular/core';
import { MgButtonBase } from './button.base';

@Directive({
  selector: 'button[mg-icon-button]',
})
export class IconButtonDirective extends MgButtonBase {
  // tslint:disable-next-line: no-input-rename
  @Input('mg-icon-button') selectorInverter = false;

  @HostBinding('class.mg-icon-button')
  get mgIconButton() {
    return !this.selectorInverter;
  }

  constructor(protected el: ElementRef<HTMLButtonElement>) {
    super(el);
  }
}
