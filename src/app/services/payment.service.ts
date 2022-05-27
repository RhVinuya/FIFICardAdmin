import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Payment } from '../models/payment';
import { firestore } from "firebase";
import Timestamp = firestore.Timestamp

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  db: AngularFirestore;

  constructor(_db: AngularFirestore){
    this.db = _db;
  }

  async getPayments(): Promise<Payment[]>{
    return new Promise((resolve, rejects) => {
        this.db.collection('payments', ref => ref.orderBy('created', 'desc')).get().subscribe(data => {
            if (!data.empty)
            {
                let payments: Payment[] = [];
                data.forEach(doc => {
                    let payment: Payment = doc.data() as Payment;
                    payment.id = doc.id;
                    payments.push(payment);
                });
                resolve(payments);
            }
            else{
                rejects("No payments found.");
            }
        });
    });
  }

  updateStatus(id: string, status: string){
    this.db.collection('payments').doc(id).update({
      status: status,
      modified: Timestamp.now()
    });
  }
}
