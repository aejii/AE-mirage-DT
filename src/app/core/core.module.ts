import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { DtInputModule } from '../design/forms/input/input.module';
import { DtSelectModule } from '../design/forms/select/select.module';
import { DtButtonModule } from '../design/indicators/button/button.module';
import { DtContainerModule } from '../design/layout/container/container.module';
import { AccountsBarComponent } from './menus-bar/menus-bar.component';
import { AccountsComponent } from './accounts/accounts.component';
import { GameInstanceComponent } from './instances-container/game-instance/game-instance.component';
import { SafePipe } from './instances-container/game-instance/safe.pipe';
import { InstancesContainerComponent } from './instances-container/instances-container.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    GameInstanceComponent,
    SafePipe,
    AccountsBarComponent,
    GameInstanceComponent,
    InstancesContainerComponent,
    AccountsComponent,
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    DragDropModule,

    DtButtonModule,
    DtContainerModule,
    DtInputModule,
    DtSelectModule,
  ],
  exports: [
    GameInstanceComponent,
    AccountsBarComponent,
    GameInstanceComponent,
    InstancesContainerComponent,
    AccountsComponent,
    SettingsComponent,
  ],
})
export class MgCoreModule {}
