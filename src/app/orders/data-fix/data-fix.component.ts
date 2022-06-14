import { Order } from './../../models/order';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from "firebase";
import { Payment } from 'src/app/models/payment';
import Timestamp = firestore.Timestamp

class OldOrder {
  public id?: string;
  public gateway: string;
  public card_price: number;
  public proof: string;
  public transaction_id: string;
  public payer_id: string;
  public payer_email: string;
  public status: string;
  public paymentId: string;
  public user_id: string;
  public created?: Timestamp;
}

@Component({
  selector: 'app-data-fix',
  templateUrl: './data-fix.component.html',
  styleUrls: ['./data-fix.component.css']
})
export class DataFixComponent implements OnInit {
  db: AngularFirestore;
  orders: OldOrder[] = [];
  ordersPrice: OldOrder[] = [];

  constructor(_db: AngularFirestore) {
    this.db = _db;
  }

  ngOnInit() {
  }

  oldOrderRecordsFix() {
    this.orders = [];
    console.log("Get Old Order Records");

    this.getOldOrders().then(data => {
      data.forEach(order => {
        if ((order.paymentId == undefined) && (order.gateway != undefined))
          this.orders.push(order);
      })

      
    console.log("Count:", this.orders.length);
    })
  }

  oldOrderRecordsPriceFix(){
    this.ordersPrice = [];
    console.log("Get Old Order Records");

    this.getOldOrdersPrice().then(data => {
      data.forEach(order => {
        this.ordersPrice.push(order);
      })

      
    console.log("Count:", this.ordersPrice.length);
    })
  }

  createPayment(order: OldOrder) {
    console.log("Create Payment for order #", order.id);

    this.getOrder(order.id).then(order => {
      if (order.paymentId == undefined) {
        console.log(order.id, order.created.toDate().toLocaleString(), order.user_id, order.paymentId, order.gateway, order.status);

        if (order.user_id != undefined) {
          let payment: Payment = new Payment();
          payment.created = order.created;
          if (payment.proof != '') {
            payment.gateway = 'GCash';
            payment.proof = order.proof;
            payment.transactionId = '';
            payment.payerId = '';
            payment.payerEmail = '';
          }
          else {
            payment.gateway = 'PayPal';
            payment.proof = '';
            payment.transactionId = order.transaction_id;
            payment.payerId = order.payer_id;
            payment.payerEmail = order.payer_email;
          }

          payment.status = order.status;
          payment.orders = [order.id];
          payment.total = Number(order.card_price);
          payment.user_id = order.user_id;


          this.addPayment(payment).then(paymentId => {
            console.log("Payment Id:" + paymentId);
            order.paymentId = paymentId;
            this.updateOrderPayment(order.id, paymentId, Number(order.card_price));
          });

        }
      }
    });
  }

  fixPriceAll(){
    this.ordersPrice.forEach(order => {
      this.updateOrderPrice(order.id, Number(order.card_price));
    })
  }

  fixPrice(order: OldOrder){
    this.updateOrderPrice(order.id, Number(order.card_price));
  }

  getOldOrders(): Promise<OldOrder[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('orders', ref => ref.orderBy("created", "desc")).get().subscribe(data => {
        if (!data.empty) {
          let orders: OldOrder[] = [];
          data.forEach(doc => {
            let order: OldOrder = doc.data() as OldOrder;
            order.id = doc.id;
            orders.push(order);
          });
          resolve(orders);
        }
        else {
          rejects("No orders found.");
        }
      });
    });
  }
  
  getOldOrdersPrice(): Promise<OldOrder[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('orders', ref => ref.where("card_price", "==", "0.00")).get().subscribe(data => {
        if (!data.empty) {
          let orders: OldOrder[] = [];
          data.forEach(doc => {
            let order: OldOrder = doc.data() as OldOrder;
            order.id = doc.id;
            orders.push(order);
          });
          resolve(orders);
        }
        else {
          rejects("No orders found.");
        }
      });
    });
  }

  getPayments(): Promise<Payment[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('payments').get().subscribe(data => {
        if (!data.empty) {
          let payments: Payment[] = [];
          data.forEach(doc => {
            let payment: Payment = doc.data() as Payment;
            payment.id = doc.id;
            payments.push(payment);
          });
          resolve(payments);
        }
        else {
          rejects("No orders found.");
        }
      });
    });
  }

  getOrder(id: string): Promise<OldOrder> {
    return new Promise((resolve, rejects) => {
      this.db.collection('orders').doc(id).get().subscribe(doc => {
        if (doc.exists) {
          let order: OldOrder = doc.data() as OldOrder;
          order.id = doc.id;
          resolve(order);
        }
        else {
          rejects("Order not found.");
        }
      });
    });
  }

  addPayment(payment: Payment): Promise<string> {
    return new Promise(resolve => {
      this.db.collection('payments').add({
        created: payment.created,
        gateway: payment.gateway,
        proof: payment.proof,
        transactionId: payment.transactionId,
        payerId: payment.payerId,
        payerEmail: payment.payerEmail,
        orders: payment.orders,
        status: payment.status,
        total: payment.total,
        user_id: payment.user_id
      }).then(data => {
        resolve(data.id);
      })
    });
  }

  updateOrderPayment(id: string, paymentId: string, cardPrice: number) {
    this.db.collection('orders/').doc(id).update({
      paymentId: paymentId,
      card_price: Number(cardPrice)
    });
  }

  updateOrderPrice(id: string, cardPrice: number) {
    this.db.collection('orders/').doc(id).update({
      card_price: Number(cardPrice)
    });
  }

}
