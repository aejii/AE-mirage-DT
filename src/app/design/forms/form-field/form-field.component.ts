import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'mg-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent implements AfterContentInit {
  isPassword = false;
  showPassword = false;

  get input() {
    return this.el.nativeElement.querySelector('input');
  }

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterContentInit() {
    this.isPassword = this.input.type === 'password';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    if (this.showPassword) this.input.type = 'text';
    else this.input.type = 'password';
  }
}
