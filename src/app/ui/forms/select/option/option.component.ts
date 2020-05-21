import {
  ChangeDetectionStrategy,
  Component,
  Host,
  HostBinding,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { DtSelectComponent } from '../select.component';

@Component({
  selector: 'dt-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtOptionComponent implements OnInit {
  @HostBinding('class.dt-option') private readonly optionClass = true;

  @Input() value: any;

  @HostBinding('class.selected') get isSelected() {
    return this.select._value.value === this.value;
  }

  constructor(@Host() private select: DtSelectComponent) {}

  ngOnInit(): void {}

  @HostListener('click') onClick() {
    this.select.writeValue(this.value);
  }
}
