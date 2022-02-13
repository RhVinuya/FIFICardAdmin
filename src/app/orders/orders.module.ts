import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderListComponent } from './order-list/order-list.component';
import { SharedModule } from '../shared/shared.module';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrderComponent } from './order/order.component';

@NgModule({
  declarations: [OrderListComponent, OrderComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule
  ],
  entryComponents: [
  ]
})
export class OrdersModule { }
