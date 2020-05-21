import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtInputDirective } from './input.directive';



@NgModule({
  declarations: [DtInputDirective],
  imports: [
    CommonModule
  ],
  exports: [DtInputDirective]
})
export class DtInputModule { }
