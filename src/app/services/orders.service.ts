import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Order } from '../models/order';
import { firestore } from "firebase";
import Timestamp = firestore.Timestamp
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  db: AngularFirestore;

  constructor(_db: AngularFirestore){
    this.db = _db;
  }

  async getOrders(): Promise<Order[]>{
    return new Promise((resolve, rejects) => {
        this.db.collection('orders', ref => ref.orderBy('created', 'desc')).get().subscribe(data => {
            if (!data.empty)
            {
                let orders: Order[] = [];
                data.forEach(doc => {
                    let order: Order = doc.data() as Order;
                    order.id = doc.id;
                    orders.push(order);
                });
                resolve(orders);
            }
            else{
                rejects("No orders found.");
            }
        });
    });
  }

  subscribeOrders(): Observable<firestore.QuerySnapshot> {
    return this.db.collection('orders').get();
  }

  async getOrder(id: string): Promise<Order>{
    return new Promise((resolve, rejects) => {
        this.db.collection('orders').doc(id).get().subscribe(doc =>{
            if (doc.exists){
                let order: Order = doc.data() as Order;
                order.id = doc.id;
                resolve(order);
            }
            else{
                rejects("Order not found.");
            }
        });
    });
  }

  async updateStatus(id: string, status: string){
    this.db.collection('orders').doc(id).update({
      status: status,
      modified: Timestamp.now()
    });
  }

  async updateUserId(id: string, userID: string){
    this.db.collection('orders').doc(id).update({
      user_Id: userID
    });
  }
}
