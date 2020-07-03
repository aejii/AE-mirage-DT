import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'dt-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtContainerComponent implements OnInit {
  @HostBinding('class.dt-container') readonly containerClass = true;

  constructor() {}

  ngOnInit(): void {}
}
