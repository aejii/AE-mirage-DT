import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  forwardRef,
  QueryList,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioButtonComponent } from './radio-button/radio-button.component';

@Component({
  selector: 'mg-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
})
export class RadioGroupComponent
  implements AfterContentInit, ControlValueAccessor {
  @ContentChildren(RadioButtonComponent) radioComponents: QueryList<
    RadioButtonComponent
  >;

  get radios() {
    return this.radioComponents?.toArray() ?? [];
  }

  private changeFn: any;

  private _value: any;

  constructor() {}

  ngAfterContentInit() {
    this.listenForRadioChanges();
    this.writeValue(this._value);
  }

  listenForRadioChanges() {
    this.radios.forEach((radio) =>
      radio.valueChange.subscribe((value) => this.writeValue(value)),
    );
  }

  writeValue(value: any): void {
    this._value = value;
    const active = this.radios.find((radio) => radio.value === value);
    const inactives = this.radios.filter((radio) => radio !== active);

    if (!active) return;

    active.active = true;
    inactives.forEach((radio) => (radio.active = false));

    this.changeFn?.(value);
  }

  registerOnChange(fn: any): void {
    this.changeFn = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
}
