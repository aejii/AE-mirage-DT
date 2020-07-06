import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'dt-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtContainerComponent implements OnInit {
  @HostBinding('class.dt-container') readonly containerClass = true;

  @Output() expand = new EventEmitter();
  @Output() closed = new EventEmitter();

  get showExpander() {
    return this.expand.observers.length > 0;
  }

  get showCloseButton() {
    return this.closed.observers.length > 0;
  }

  constructor() {}

  ngOnInit(): void {}
}
