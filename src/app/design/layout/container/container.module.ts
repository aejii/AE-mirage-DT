import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DtButtonModule } from '../../indicators/button/button.module';
import { DtContainerTitleDirective } from './container-title.directive';
import { DtContainerComponent } from './container.component';

@NgModule({
  declarations: [DtContainerComponent, DtContainerTitleDirective],
  imports: [CommonModule, FlexLayoutModule, DtButtonModule],
  exports: [DtContainerComponent, DtContainerTitleDirective],
})
export class DtContainerModule {}
