import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'mg-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoComponent implements OnInit {

  @Input() color: 'primary' | 'error';

  get isPrimary() {
    return this.color === 'primary';
  }

  constructor() { }

  ngOnInit(): void {
  }

}
