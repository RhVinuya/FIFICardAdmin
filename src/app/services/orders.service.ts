import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Order } from '../models/order';

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
        this.db.collection('orders').get().subscribe(data => {
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
}
