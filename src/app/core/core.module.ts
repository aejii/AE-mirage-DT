import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GameInstanceComponent } from './game-instance/game-instance.component';
import { SafePipe } from './game-instance/safe.pipe';

@NgModule({
  declarations: [GameInstanceComponent, SafePipe],
  imports: [CommonModule],
  exports: [GameInstanceComponent],
})
export class MgCoreModule {}
