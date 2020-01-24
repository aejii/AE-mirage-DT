import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'mg-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent implements OnInit {

  @Input() value = 100;

  @Input() error = false;

  get progress() {
    return this.value < 0 ? 0 : this.value > 100 ? 100 : this.value;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
