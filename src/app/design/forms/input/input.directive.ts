import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[dtInput]',
})
export class DtInputDirective {
  @HostBinding('class.dt-input') readonly inputClass = true;

  constructor() {}
}
