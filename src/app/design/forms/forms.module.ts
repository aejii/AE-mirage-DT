import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from './form-field/form-field.component';
import { RadioGroupComponent } from './radio-group/radio-group.component';
import { RadioButtonComponent } from './radio-group/radio-button/radio-button.component';



@NgModule({
  declarations: [FormFieldComponent, RadioGroupComponent, RadioButtonComponent],
  imports: [
    CommonModule
  ],
  exports: [FormFieldComponent, RadioGroupComponent, RadioButtonComponent],
})
export class MgFormsModule { }
