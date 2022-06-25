import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Status } from '../models/status';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  db: AngularFirestore;

  constructor(_db: AngularFirestore){
    this.db = _db;
  }

  async getStatuses(): Promise<Status[]>{
    return new Promise((resolve, rejects) => {
      this.db.collection('status').get().subscribe(data => {
        if (!data.empty)
        {
          let statuses: Status[] = [];
          data.forEach(doc => {
            let status: Status = doc.data() as Status;
            status.id = doc.id;
            statuses.push(status);
          });
          resolve(statuses);
        }
        else{
          rejects("No status found.");
        }
      });
    });
  }

  async addStatus(status: Status): Promise<string>{
    return new Promise(resolve => {
      this.db.collection('status').add({
       name: status.name,
       active: status.active,
       initial: status.initial
      }).then(data => {
        resolve(data.id);
      })
    });
  }

  async updateActive(status: Status): Promise<void>{
    return this.db.collection('status').doc(status.id).update({
        active: status.active
    }); 
  }

  async updateInitial(status: Status): Promise<void>{
    return this.db.collection('status').doc(status.id).update({
        initial: status.initial
    }); 
  }

  async updateName(status: Status): Promise<void>{
    return this.db.collection('status').doc(status.id).update({
      name: status.name
    }); 
  }
}
