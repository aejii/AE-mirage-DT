import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[dtContainerTitle]'
})
export class DtContainerTitleDirective {

  @HostBinding('class.title') private readonly TITLE_CLASS = true;

  constructor() { }

}
