import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'dt-tab-list-item',
  templateUrl: './tab-list-item.component.html',
  styleUrls: ['./tab-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtTabListItemComponent implements OnInit {
  @Input() label: string;

  @ViewChild('contentRef', { static: true }) private contentRef: ElementRef<
    HTMLElement
  >;

  active = false;

  get content() {
    return this.contentRef?.nativeElement;
  }

  constructor() {}

  ngOnInit(): void {}
}
