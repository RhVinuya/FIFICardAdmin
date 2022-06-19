import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Fee } from '../models/fee';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  db: AngularFirestore;

  constructor(
    _db: AngularFirestore
  ) {
    this.db = _db;
  }

  async getShippingFees(): Promise<Fee[]>{
    return new Promise((resolve, rejects) => {
      this.db.collection('shippingfee').get().subscribe(data => {
        if (!data.empty)
        {
          let fees: Fee[] = [];
          data.forEach(doc => {
            let fee: Fee = doc.data() as Fee;
            fee.id = doc.id;
            fees.push(fee);
          });
          resolve(fees);
        }
        else{
          rejects("No shipping fee found.");
        }
      });
    });
  }

  async addShippingFee(fee: Fee): Promise<string>{
    return new Promise(resolve => {
      this.db.collection('shippingfee').add({
       name: fee.name,
       metromanila: fee.metromanila==undefined?Number(0):Number(fee.metromanila),
        luzon: fee.luzon==undefined?Number(0):Number(fee.luzon),
        visayas: fee.visayas==undefined?Number(0):Number(fee.visayas),
        mindanao: fee.mindanao==undefined?Number(0):Number(fee.mindanao)
      }).then(data => {
        resolve(data.id);
      })
    });
  }

  async updateShippingFee(fee: Fee): Promise<void>{
    return this.db.collection('shippingfee').doc(fee.id).update({
      metromanila: fee.metromanila==undefined?Number(0):Number(fee.metromanila),
      luzon: fee.luzon==undefined?Number(0):Number(fee.luzon),
      visayas: fee.visayas==undefined?Number(0):Number(fee.visayas),
      mindanao: fee.mindanao==undefined?Number(0):Number(fee.mindanao)
    }); 
  }
}
