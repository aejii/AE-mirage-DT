import { HostBinding, Input, ElementRef, HostListener } from '@angular/core';

export class MgButtonBase {

  @Input() color: 'primary' | 'error';

  @HostBinding('class.mg-button-primary')
  get colorPrimary() {
    return this.color === 'primary';
  }

  @HostBinding('class.mg-button-error')
  get colorError() {
    return this.color === 'error';
  }

  constructor(protected el: ElementRef<HTMLButtonElement>) {}

  @HostListener('click', ['$event'])
  onClick() {
    this.el.nativeElement.classList.add('mg-active');
    setTimeout(() => this.el.nativeElement.classList.remove('mg-active'), 200);
  }

  getElement() {
    return this.el.nativeElement;
  }
}
