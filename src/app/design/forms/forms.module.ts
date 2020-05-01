import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MgCardModule } from '../layout/card/card.module';
import { FormFieldComponent } from './form-field/form-field.component';
import { RadioButtonComponent } from './radio-group/radio-button/radio-button.component';
import { RadioGroupComponent } from './radio-group/radio-group.component';
import { MgOptionComponent } from './select/option/option.component';
import { MgSelectComponent } from './select/select.component';

@NgModule({
  declarations: [
    FormFieldComponent,
    RadioGroupComponent,
    RadioButtonComponent,
    MgSelectComponent,
    MgOptionComponent,
  ],
  imports: [
    CommonModule,
    PortalModule,
    OverlayModule,
    MatIconModule,
    MgCardModule,
  ],
  exports: [
    FormFieldComponent,
    RadioGroupComponent,
    RadioButtonComponent,
    MgSelectComponent,
    MgOptionComponent,
  ],
})
export class MgFormsModule {}
