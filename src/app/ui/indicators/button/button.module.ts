import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtButtonDirective } from './button.directive';



@NgModule({
  declarations: [DtButtonDirective],
  imports: [
    CommonModule
  ],
  exports: [DtButtonDirective]
})
export class DtButtonModule { }
