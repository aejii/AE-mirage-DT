import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DtButtonModule } from '../../indicators/button/button.module';
import { DtContainerComponent } from './container.component';

@NgModule({
  declarations: [DtContainerComponent],
  imports: [CommonModule, FlexLayoutModule, DtButtonModule],
  exports: [DtContainerComponent],
})
export class DtContainerModule {}
