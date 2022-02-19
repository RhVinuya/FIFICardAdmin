import { ConfigComponent } from './config.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ConfigRoutingModule } from './config-routing.module';
import { EventListComponent } from './event-list/event-list.component';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ConfigRoutingModule,
    SharedModule
  ],
  declarations: [
    ConfigComponent,
    EventListComponent,
    DialogComponent
  ],
  entryComponents: [
    DialogComponent
  ]
})
export class ConfigModule { }
