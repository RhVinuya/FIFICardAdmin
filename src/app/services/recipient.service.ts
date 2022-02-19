import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Recipient } from '../models/recipient';

@Injectable({
  providedIn: 'root'
})
export class RecipientService {
  db: AngularFirestore;

  constructor(_db: AngularFirestore){
    this.db = _db;
  }

  async getRecipients(): Promise<Recipient[]>{
    return new Promise((resolve, rejects) => {
      this.db.collection('recipients').get().subscribe(data => {
        if (!data.empty)
        {
          let recipients: Recipient[] = [];
          data.forEach(doc => {
            let recipient: Recipient = doc.data() as Recipient;
            recipient.id = doc.id;
            recipients.push(recipient);
          });
          resolve(recipients);
        }
        else{
          rejects("No recipients found.");
        }
      });
    });
  }

  async addRecipient(recipient: Recipient): Promise<string>{
    return new Promise(resolve => {
      this.db.collection('recipients').add({
       name: recipient.name,
       active: recipient.active
      }).then(data => {
        resolve(data.id);
      })
    });
  }

  async updateActive(recipient: Recipient): Promise<void>{
    return this.db.collection('recipients').doc(recipient.id).update({
        active: recipient.active
    }); 
  }
}
