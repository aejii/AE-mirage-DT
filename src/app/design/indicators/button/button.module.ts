import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonDirective } from './button.directive';
import { IconButtonDirective } from './icon-button.directive';
import { ToggleButtonDirective } from './toggle-button.directive';

@NgModule({
  declarations: [IconButtonDirective, ButtonDirective, ToggleButtonDirective],
  exports: [IconButtonDirective, ButtonDirective, ToggleButtonDirective],
  imports: [CommonModule],
})
export class MgButtonModule {}
