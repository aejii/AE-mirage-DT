import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  forwardRef,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MgOptionComponent } from './option/option.component';

@Component({
  selector: 'mg-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MgSelectComponent),
      multi: true,
    },
  ],
})
export class MgSelectComponent implements ControlValueAccessor, AfterViewInit {
  private _onTouched: (...args) => any;
  private _onChange: (...args) => any;

  value$ = new BehaviorSubject(undefined);

  @ContentChildren(MgOptionComponent) options: QueryList<MgOptionComponent>;

  @ViewChild('optionsPortal') optionsPortalContent: TemplateRef<any>;
  optionsPortal: TemplatePortal;
  overlayRef: OverlayRef;

  constructor(
    private viewRef: ViewContainerRef,
    private overlay: Overlay,
    private elRef: ElementRef<HTMLElement>,
  ) {}

  ngAfterViewInit() {
    this.optionsPortal = new TemplatePortal(
      this.optionsPortalContent,
      this.viewRef,
    );
  }

  writeValue(value: any): void {
    this.value$.next(value);
    this.overlayRef?.dispose();
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  openOptions() {
    this.overlayRef?.dispose();
    this.overlayRef = this.overlay.create({
      width: this.elRef.nativeElement.clientWidth,
      height: 'auto',
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.elRef.nativeElement)
        .withFlexibleDimensions(false)
        .withGrowAfterOpen(false)
        .withPositions([
          {
            originX: 'start' as any,
            originY: 'bottom' as any,
            overlayX: 'start' as any,
            overlayY: 'top' as any,
          },
        ]),
      hasBackdrop: true,
      backdropClass: 'mg-options-overlay-backdrop',
    });
    this.overlayRef.backdropClick().subscribe(() => this.overlayRef?.dispose());
    this.overlayRef.attach(this.optionsPortal);
  }
}
