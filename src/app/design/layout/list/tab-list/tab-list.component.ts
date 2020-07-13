import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  QueryList,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { DtTabListItemComponent } from './tab-list-item/tab-list-item.component';

@Component({
  selector: 'dt-tab-list',
  templateUrl: './tab-list.component.html',
  styleUrls: ['./tab-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtTabListComponent implements AfterContentInit {
  @HostBinding('class.dt-tab-list') private readonly dtClass = true;

  @ContentChildren(DtTabListItemComponent) listItemsRefs: QueryList<
    DtTabListItemComponent
  >;

  @ViewChild('contentRef', { static: true }) contentRef: ElementRef<HTMLElement>;

  tabContent: HTMLElement;

  get tabs() {
    return this.listItemsRefs?.toArray?.();
  }

  constructor(private renderer: Renderer2) {}

  ngAfterContentInit(): void {
    this.showTabContent(this.tabs[0]);
  }

  showTabContent(tab: DtTabListItemComponent) {
    this.contentRef.nativeElement.innerHTML = '';

    this.tabs.forEach((t) => (t.active = false));
    tab.active = true;

    this.renderer.appendChild(this.contentRef.nativeElement, tab.content);
  }
}
