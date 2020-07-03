import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtContainerComponent } from './container.component';



@NgModule({
  declarations: [DtContainerComponent],
  imports: [
    CommonModule
  ],
  exports: [DtContainerComponent]
})
export class DtContainerModule { }
