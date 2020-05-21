import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[dt-button],[dt-icon-button]'
})
export class DtButtonDirective {

  @Input('dt-button') dtButton = true;
  @HostBinding('class.dt-button') get dtButtonClass() {
    return !this.dtButton;
  }

  @Input('dt-icon-button') dtIconButton = true;
  @HostBinding('class.dt-icon-button') get dtIconButtonClass() {
    return !this.dtIconButton;
  }

  constructor() { }

}
