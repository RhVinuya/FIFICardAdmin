import { Occasion } from 'src/app/models/occasion';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  db: AngularFirestore;

  constructor(_db: AngularFirestore){
    this.db = _db;
  }

  async getEvents(): Promise<Occasion[]>{
    return new Promise((resolve, rejects) => {
      this.db.collection('events').get().subscribe(data => {
        if (!data.empty)
        {
          let occasions: Occasion[] = [];
          data.forEach(doc => {
            let occasion: Occasion = doc.data() as Occasion;
            occasion.id = doc.id;
            occasions.push(occasion);
          });
          resolve(occasions);
        }
        else{
          rejects("No events found.");
        }
      });
    });
  }

  async addEvent(occasion: Occasion): Promise<string>{
    return new Promise(resolve => {
      this.db.collection('events').add({
       name: occasion.name,
       active: occasion.active
      }).then(data => {
        resolve(data.id);
      })
    });
  }

  async updateActive(occasion: Occasion): Promise<void>{
    return this.db.collection('events').doc(occasion.id).update({
        active: occasion.active
    }); 
  }

  async updateIsGift(occasion: Occasion): Promise<void>{
    return this.db.collection('events').doc(occasion.id).update({
        isGift: occasion.isGift
    }); 
  }

  async updateIsCreations(occasion: Occasion): Promise<void>{
    return this.db.collection('events').doc(occasion.id).update({
        isCreations: occasion.isCreations
    }); 
  }

  async updateIsSticker(occasion: Occasion): Promise<void>{
    return this.db.collection('events').doc(occasion.id).update({
      isSticker: occasion.isSticker
    }); 
  }

  async updateName(occasion: Occasion): Promise<void>{
    return this.db.collection('events').doc(occasion.id).update({
      name: occasion.name
    }); 
  }
}
