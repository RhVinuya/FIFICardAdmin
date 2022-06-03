import { UploadService } from './../../services/upload.service';
import { PaymentStatusDialogComponent } from './../payment-status-dialog/payment-status-dialog.component';
import { CardsService } from 'src/app/services/cards.service';
import { UsersService } from './../../services/users.service';
import { OrdersService } from './../../services/orders.service';
import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { MatDialog, MatDialogConfig, MatDialogRef, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaymentService } from 'src/app/services/payment.service';
import { Payment } from 'src/app/models/payment';
import { Card } from 'src/app/models/card';

class PaymentOrder {
  public id: string;
  public order: Order
  public card: Card;
  public payment: Payment;
  public image: string = '';

  constructor(_id: string) {
    this.id = _id;
  }
}

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  paymentService: PaymentService;
  orderService: OrdersService;
  cardService: CardsService;
  uploadService: UploadService;

  paymentOrders: PaymentOrder[] = [];
  dialogRef: MatDialogRef<PaymentStatusDialogComponent>;


  fb: FormBuilder;
  searchForm: FormGroup;

  orders: Order[];
  displayOrder: Order[] = [];
  length: number;
  pageIndex: number = 0;
  pageSize: number = 10; 
  pageSizeOptions: number[] = [10, 20, 50, 100];

  initializing: boolean = false;
  withRecords: boolean = false;
  status: string[] = [];
  cards: string[] = [];
  filterStatus: string = '';
  dataSource: MatTableDataSource<PaymentOrder> = new MatTableDataSource();
  displayedColumns: string[] = ['card', 'sender', 'recipient', 'address', 'payment', 'paymentstatus', 'date', 'signandsend', 'action'];

  constructor(
    private _paymentService: PaymentService,
    private _orderService: OrdersService,
    private _cardService: CardsService,
    private _uploadService: UploadService,
    private _fb: FormBuilder,
    private userService: UsersService,
    private dialog: MatDialog
  ) {
    this.paymentService = _paymentService;
    this.orderService = _orderService;
    this.cardService = _cardService;
    this.uploadService = _uploadService;
    this.fb = _fb;
  }

  ngOnInit() {
    this.loadPayment();

    this.searchForm = this.fb.group({
      status: ['All'],
      card: ['All'],
      search: ['']
    })
  }

  loadPayment() {
    this.initializing = true;
    this.withRecords = true;

    this.paymentService.getPayments().then(payments => {
      if (payments.length > 0) {
        payments.forEach(payment => {
          payment.orders.forEach(orderId => {
            this.orderService.getOrder(orderId).then(order => {
              this.cardService.getCard(order.card_id).then(card => {
                this.addOrder(order, card, payment);
                this.updateRange();
              });
            });
          })
        });
        this.withRecords = true;
      }
      this.initializing = false;
    })
  }

  addOrder(order: Order, card: Card, payment: Payment) {
    let paymentOrder: PaymentOrder = new PaymentOrder(order.id);
    paymentOrder.order = order;
    paymentOrder.card = card;
    paymentOrder.payment = payment;
    this.paymentOrders.push(paymentOrder);
  }

  updateRange() {
    this.length = this.paymentOrders.length;
    let start: number = this.pageIndex * this.pageSize;
    let end: number = start + this.pageSize;
    let selectedOrders: PaymentOrder[] = [];
    for (let i = start; i < end; i++) {
      if (this.paymentOrders[i]) {
        selectedOrders.push(this.paymentOrders[i]);
      }
    }
    this.dataSource.data = selectedOrders;
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateRange();
  }

  paymentLink(payment: Payment){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      payment: payment,
    }
    this.dialogRef = this.dialog.open(PaymentStatusDialogComponent, dialogConfig);
    this.dialogRef.afterClosed().subscribe(response => {
      this.paymentOrders.forEach(paymentOrder => {
        if (paymentOrder.payment.id == response.id){
          paymentOrder.payment.status = response.status;
        }
      })
    });
  }

  /*
  loadOrders() {
    this.initializing = true;
    this.withRecords = true;

    this.service.getOrders().then(orders => {
      this.orders = orders;
      this.searchRecords('', 'All', 'All');
      this.generateFilter();

      this.initializing = false;
      this.withRecords = true;

    }).then(reason => {
      this.initializing = false;
      this.withRecords = true;
    })
  }

  generateFilter() {
    this.status.slice();
    if (this.orders) {
      if (this.orders.length > 0) {
        this.orders.forEach(order => {
          this.addStatus(order.status.trim());
          this.addCard(order.card_name.trim());
        })
      }
    }
  }

  addStatus(_status: string) {
    let isFound: Boolean = false;
    this.status.forEach(status => {
      if (_status == status) {
        isFound = true;
      }
    });
    if (!isFound)
      this.status.push(_status);
  }

  addCard(_card: string) {
    let isFound: Boolean = false;
    this.cards.forEach(card => {
      if (_card == card) {
        isFound = true;
      }
    });
    if (!isFound)
      this.cards.push(_card);
  }

  updateRange() {
    let start: number = this.pageIndex * this.pageSize;
    let end: number = start + this.pageSize;
    let selectedOrders: Order[] = [];
    for (let i = start; i < end; i++) {
      if (this.displayOrder[i]) {
        selectedOrders.push(this.displayOrder[i]);
      }
    }
    this.dataSource.data = selectedOrders;
  }

  

  searchCard() {
    let search: string = this.searchForm.value['search'];
    let card: string = this.searchForm.value['card'];
    let status: string = this.searchForm.value['status'];
    this.searchRecords(search, card, status);
  }

  searchRecords(search: string, card: string, status: string) {
    this.initializing = true;
    this.withRecords = true;
    this.displayOrder = [];

    if ((search.length == 0) && (status == 'All') && (card == 'All')) {
      this.displayOrder = this.orders;
      this.length = this.displayOrder.length;
      this.updateRange();
    }
    else {
      this.orders.forEach(order => {
        let searchMatch: boolean = true;
        let cardMatch: boolean = true;
        let statusMatch: boolean = true;

        if (search.length > 0) {
          if (order.sender_name.includes(search)) {
            searchMatch = true;
          }
          else if (order.receiver_name.includes(search)) {
            searchMatch = true;
          }
          else {
            searchMatch = false;
          }
        }

        if (card != 'All') {
          if (order.card_name.trim() != card.trim()) {
            cardMatch = false;
          }
        }

        if (status != 'All') {
          if (order.status.trim() != status.trim()) {
            statusMatch = false;
          }
        }

        if (searchMatch && statusMatch && cardMatch) {
          this.displayOrder.push(order);
        }
      });

      this.length = this.displayOrder.length;
      this.updateRange();
    }

    this.initializing = false;
    this.withRecords = this.length > 0;
  }

  validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  fixOrders() {
    this.service.getOrders().then(orders => {
      orders.forEach(order => {
        if (this.validateEmail(order.sender_email)) {
          this.userService.getUserByEmail(order.sender_email).then(user => {
            //this.service.updateUserId(order.id, user.id)
          }).catch(reason => {
          })
        }
      })
    })
  }

  */
}
