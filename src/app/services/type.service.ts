import { TypeUpgrade } from './../models/type';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Type } from '../models/type';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  db: AngularFirestore;

  constructor(_db: AngularFirestore) {
    this.db = _db;
  }

  async getTypes(): Promise<Type[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cardtype').get().subscribe(data => {
        if (!data.empty) {
          let types: Type[] = [];
          data.forEach(doc => {
            let type: Type = doc.data() as Type;
            type.id = doc.id;
            types.push(type);
          });
          resolve(types);
        }
        else {
          rejects("No card types found.");
        }
      });
    });
  }

  async addType(type: Type): Promise<string> {
    return new Promise(resolve => {
      this.db.collection('cardtype').add({
        name: type.name,
        active: type.active
      }).then(data => {
        resolve(data.id);
      })
    });
  }

  async updateType(type: Type): Promise<void> {
    return this.db.collection('cardtype').doc(type.id).update({
      name: type.name
    });
  }

  async updateActive(type: Type): Promise<void> {
    return this.db.collection('cardtype').doc(type.id).update({
      active: type.active
    });
  }

  async updateName(type: Type): Promise<void> {
    return this.db.collection('cardtype').doc(type.id).update({
      name: type.name
    });
  }

  /*----------------------------------------------------------*/

  async getTypeUpgrades(): Promise<TypeUpgrade[]> {
    return new Promise((resolve, rejects) => {
      this.db.collection('cardtypeupgrade').get().subscribe(data => {
        if (!data.empty) {
          let typeUpgrades: TypeUpgrade[] = [];
          data.forEach(doc => {
            let upgrade: TypeUpgrade = doc.data() as TypeUpgrade;
            upgrade.id = doc.id;
            typeUpgrades.push(upgrade);
          });
          resolve(typeUpgrades);
        }
        else {
          rejects("No type Upgrade found.");
        }
      });
    });
  }

  async addTypeUpgrade(typeUpgrade: TypeUpgrade): Promise<string> {
    return new Promise(resolve => {
      this.db.collection('cardtypeupgrade').add({
        from: typeUpgrade.from,
        to: typeUpgrade.to,
        active: typeUpgrade.active,
        add_price: typeUpgrade.add_price
      }).then(data => {
        resolve(data.id);
      })
    });
  }

  async updateTypeUpgrade(typeUpgrade: TypeUpgrade): Promise<void> {
    return this.db.collection('cardtypeupgrade').doc(typeUpgrade.id).update({
      from: typeUpgrade.from,
      to: typeUpgrade.to,
      add_price: typeUpgrade.add_price
    });
  }

  async updateTypeUpgradeActive(typeUpgrade: TypeUpgrade): Promise<void> {
    return this.db.collection('cardtypeupgrade').doc(typeUpgrade.id).update({
      active: typeUpgrade.active
    });
  }
}
