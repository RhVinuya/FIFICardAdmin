import { PaymentStatusDialogComponent } from './../payment-status-dialog/payment-status-dialog.component';
import { CardsService } from 'src/app/services/cards.service';
import { OrdersService } from 'src/app/services/orders.service';
import { UploadService } from './../../services/upload.service';
import { UsersService } from 'src/app/services/users.service';
import { Component, OnInit, Input } from '@angular/core';
import { Payment } from 'src/app/models/payment';
import { User } from '../../models/user';
import { Order } from 'src/app/models/order';
import { Card } from 'src/app/models/card';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';

class Item {
  public id: string;
  public order: Order;
  public card: Card;

  constructor(_id: string) {
    this.id = _id;
    this.order = new Order();
    this.card = new Card();
  }
}

@Component({
  selector: 'app-order-thumb',
  templateUrl: './order-thumb.component.html',
  styleUrls: ['./order-thumb.component.css']
})
export class OrderThumbComponent implements OnInit {
  @Input() payment: Payment;
  userService: UsersService;
  uploadService: UploadService;
  orderService: OrdersService;
  cardService: CardsService;

  user: User;
  proof: string;
  items: Item[] = [];

  expand: boolean = false;

  paymentDialog: MatDialogRef<PaymentStatusDialogComponent>;

  constructor(
    _userService: UsersService,
    _uploadService: UploadService,
    _orderService: OrdersService,
    _cardService: CardsService,
    private dialog: MatDialog
  ) {
    this.userService = _userService;
    this.uploadService = _uploadService;
    this.orderService = _orderService;
    this.cardService = _cardService;
  }

  ngOnInit() {
    this.getUser();

    if (this.payment.gateway == 'GCash') {
      this.getProof();
    }

    this.getOrders();
  }

  getUser() {
    this.userService.getUser(this.payment.user_id).then(user => {
      this.user = user;
    })
  }

  getProof() {
    this.uploadService.getDownloadURL(this.payment.proof).then(url => {
      this.proof = url;

    })
  };

  getOrders() {
    this.payment.orders.forEach(order => {
      this.items.push(new Item(order));
      this.getOrder(order);
    })
  }

  getOrder(id: string) {
    this.orderService.getOrder(id).then(order => {
      this.items.forEach(item => {
        if (item.id == id) {
          item.order = order;
          this.getCard(id, order.card_id);
        }
      })
    })
  }

  getCard(orderId: string, id: string) {
    this.cardService.getCard(id).then(card => {
      this.items.forEach(item => {
        if (item.id == orderId) {
          item.card = card;
        }
      })
    })
  }

  clickExpand() {
    this.expand = !this.expand;
  }

  clickPaymentStatus() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      payment: this.payment
    }
    this.paymentDialog = this.dialog.open(PaymentStatusDialogComponent, dialogConfig);

    this.paymentDialog.afterClosed().subscribe(data => {
      if (data) {
        console.log(data);
      }
    });
  }
}
