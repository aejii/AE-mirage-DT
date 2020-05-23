import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DtButtonModule } from '../ui/indicators/button/button.module';
import { DtContainerModule } from '../ui/layout/container/container.module';
import { AccountsBarComponent } from './accounts-bar/accounts-bar.component';
import { GameInstanceComponent } from './game-instance/game-instance.component';
import { SafePipe } from './game-instance/safe.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [GameInstanceComponent, SafePipe, AccountsBarComponent],
  imports: [CommonModule, DtContainerModule, DtButtonModule, FlexLayoutModule],
  exports: [GameInstanceComponent, AccountsBarComponent],
})
export class MgCoreModule {}
