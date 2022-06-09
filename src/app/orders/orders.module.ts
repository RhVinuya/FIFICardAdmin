import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderListComponent } from './order-list/order-list.component';
import { SharedModule } from '../shared/shared.module';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrderComponent } from './order/order.component';
import { OrderSignAndSendDialogComponent } from './order-sign-and-send-dialog/order-sign-and-send-dialog.component';
import { PaymentStatusDialogComponent } from './payment-status-dialog/payment-status-dialog.component';
import { DataFixComponent } from './data-fix/data-fix.component';

@NgModule({
  declarations: [OrderListComponent, OrderComponent, OrderSignAndSendDialogComponent, PaymentStatusDialogComponent, DataFixComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule
  ],
  entryComponents: [
    OrderSignAndSendDialogComponent,
    PaymentStatusDialogComponent
  ]
})
export class OrdersModule { }
