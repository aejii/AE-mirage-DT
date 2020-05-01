import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'mg-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MgOptionComponent {
  @Input() value: any;

  constructor(private ngControl: NgControl) {}

  @HostListener('click')
  valueChange() {
    this.ngControl.control.setValue(this.value);
  }
}
