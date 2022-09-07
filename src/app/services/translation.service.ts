import { EMPTY } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Translation } from '../models/translation';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  db: AngularFirestore;

  constructor(
    _db: AngularFirestore
  ) {
    this.db = _db;
  }

  getTranslation(id: string): Promise<Translation>{
    return new Promise((resolve, rejects) => {
      this.db.collection('translations').doc(id).get().subscribe(doc => {
        if (doc.exists) {
          resolve(doc.data()['input'] as Translation);
        }
        else{
          rejects('not found');
        }
      });
    });
  }

  createTranslation(id: string, transllation: Translation): Promise<void>{
    return this.db.collection('translations').doc(id).set({
      'input': {
        'description': transllation.description
      }
    });
  }

  updateTranslation(id: string, translation: Translation): Promise<void>{
    return this.db.collection('translations').doc(id).update({
      'input': {
        'description': translation.description
      }
    })
  }
}
