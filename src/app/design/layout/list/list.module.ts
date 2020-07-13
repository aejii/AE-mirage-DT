import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DtTabListItemComponent } from './tab-list/tab-list-item/tab-list-item.component';
import { DtTabListComponent } from './tab-list/tab-list.component';

@NgModule({
  declarations: [DtTabListComponent, DtTabListItemComponent],
  imports: [CommonModule, FlexLayoutModule],
  exports: [DtTabListComponent, DtTabListItemComponent],
})
export class DtListModule {}
