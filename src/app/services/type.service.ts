import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Type } from '../models/type';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  db: AngularFirestore;

  constructor(_db: AngularFirestore){
    this.db = _db;
  }

  async getTypes(): Promise<Type[]>{
    return new Promise((resolve, rejects) => {
      this.db.collection('cardtype').get().subscribe(data => {
        if (!data.empty)
        {
          let types: Type[] = [];
          data.forEach(doc => {
            let type: Type = doc.data() as Type;
            type.id = doc.id;
            types.push(type);
          });
          resolve(types);
        }
        else{
          rejects("No card types found.");
        }
      });
    });
  }

  async addType(type: Type): Promise<string>{
    return new Promise(resolve => {
      this.db.collection('cardtype').add({
       name: type.name,
       active: type.active
      }).then(data => {
        resolve(data.id);
      })
    });
  }

  async updateActive(type: Type): Promise<void>{
    return this.db.collection('cardtype').doc(type.id).update({
        active: type.active
    }); 
  }
}
