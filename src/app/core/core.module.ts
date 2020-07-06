import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GameInstanceComponent } from './instances-container/game-instance/game-instance.component';
import { SafePipe } from './instances-container/game-instance/safe.pipe';
import { InstancesContainerComponent } from './instances-container/instances-container.component';

@NgModule({
  declarations: [
    GameInstanceComponent,
    InstancesContainerComponent,
    SafePipe,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FlexLayoutModule,
  ],
  exports: [
    GameInstanceComponent,
    InstancesContainerComponent,
  ],
})
export class MgCoreModule {}
