import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UIService } from '@providers';

@Component({
  selector: 'mg-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainMenuComponent implements OnInit, AfterViewInit {
  @ViewChild('menu', { static: true, read: ElementRef }) menuRef: ElementRef<
    HTMLElement
  >;

  isMenuOffset = false;

  get menuOffset() {
    const hostWidth = this.elRef.nativeElement?.offsetWidth ?? 0;
    const menuWidth = this.menuRef.nativeElement?.offsetWidth ?? 0;

    const offset = this.isMenuOffset ? menuWidth - hostWidth : 0;

    return offset;
  }

  constructor(
    private elRef: ElementRef<HTMLElement>,
    private cdRef: ChangeDetectorRef,
    public UI: UIService,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    // Required to place the menu correctly
    this.cdRef.detectChanges();
  }
}
