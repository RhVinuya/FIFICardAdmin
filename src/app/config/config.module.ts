import { ConfigComponent } from './config.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ConfigRoutingModule } from './config-routing.module';
import { EventListComponent } from './event-list/event-list.component';
import { DialogComponent } from './dialog/dialog.component';
import { RecipientListComponent } from './recipient-list/recipient-list.component';
import { StatusListComponent } from './status-list/status-list.component';
import { RatingDialogComponent } from '../cards/rating-dialog/rating-dialog.component';
import { ShippingFeeComponent } from './shipping-fee/shipping-fee.component';
import { FeeComponent } from './shipping-fee/fee/fee.component';
import { TypeListComponent } from './type-list/type-list.component';

@NgModule({
  imports: [
    CommonModule,
    ConfigRoutingModule,
    SharedModule
  ],
  declarations: [
    ConfigComponent,
    EventListComponent,
    DialogComponent,
    RecipientListComponent,
    StatusListComponent,
    ShippingFeeComponent,
    FeeComponent,
    TypeListComponent
  ],
  entryComponents: [
    DialogComponent
  ]
})
export class ConfigModule { }
