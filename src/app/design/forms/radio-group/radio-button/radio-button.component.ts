import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'mg-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonComponent implements OnInit {
  @Input() value: any;

  @HostBinding('class.mg-radio-active')
  active = false;

  @Input() direction: 'left' | 'right' = 'left';

  @HostBinding('class.mg-inverted')
  private get inverted() {
    return this.direction === 'right';
  }

  @Output() valueChange = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  @HostListener('click', ['$event'])
  onClick() {
    this.valueChange.emit(this.value);
  }
}
