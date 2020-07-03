import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { DtOptionComponent } from './option/option.component';
import { DtSelectComponent } from './select.component';

@NgModule({
  declarations: [DtSelectComponent, DtOptionComponent],
  exports: [DtSelectComponent, DtOptionComponent],
  imports: [
    CommonModule,
    PortalModule,
    OverlayModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
})
export class DtSelectModule {}
