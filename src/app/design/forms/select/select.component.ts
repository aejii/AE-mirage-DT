import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'dt-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DtSelectComponent),
      multi: true,
    },
  ],
})
export class DtSelectComponent implements AfterViewInit, ControlValueAccessor {
  @HostBinding('class.dt-select') readonly selectClass = true;

  @ViewChild('optionsPortal') optionsPortalContent: TemplateRef<any>;
  optionsPortal: TemplatePortal;
  overlayRef: OverlayRef;

  private _changeFn: any;
  private _touchFn: any;

  @Input() placeholder = ' ';

  _value = new BehaviorSubject<any>(undefined);
  public value$ = this._value.asObservable();

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

  registerOnChange(fn: any) {
    this._changeFn = fn;
  }

  registerOnTouched(fn: any) {
    this._touchFn = fn;
  }

  setDisabledState(value: boolean) {}

  writeValue(value: any) {
    this._changeFn?.(value);
    this.overlayRef?.dispose?.();
    value && this._value.next(value);
  }

  @HostListener('click')
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
    });
    this.overlayRef.backdropClick().subscribe(() => this.overlayRef?.dispose());
    this.overlayRef.attach(this.optionsPortal);
  }
}
