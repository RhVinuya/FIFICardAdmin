import { OrdersService } from './../../services/orders.service';
import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  service: OrdersService;

  orders: Order[];
  initializing: boolean = false;
  withRecords: boolean = false;
  status: string[] = [];
  dataSource: MatTableDataSource<Order  > = new MatTableDataSource();
  displayedColumns: string[] = ['card', 'sender', 'recipient', 'anonymously', 'sendto', 'status', 'action'];

  constructor(
    _service: OrdersService
  ) { 
    this.service = _service;
  }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders(){
    this.initializing = true;
    this.withRecords = false;

    this.service.getOrders().then(orders => {
      this.orders = orders;
      this.dataSource.data = this.orders;
      this.generateFilter();
      
      this.initializing = false;
      this.withRecords = true;

    }).then(reason => {
      this.initializing = false;
      this.withRecords = true;
      console.log(reason);
    })
  }

  generateFilter(){
    this.status.slice();
    if (this.orders){
      if(this.orders.length > 0){
        this.status.push('All');
        this.orders.forEach(order => {
          this.addStatus(order.status);
        })
      }
    }
  }

  addStatus(_status: string){
    let isFound: Boolean = false;
    this.status.forEach(status => {
      if(_status == status){
        isFound = true;
      }
    });
    if (!isFound)
      this.status.push(_status);
  }

}
