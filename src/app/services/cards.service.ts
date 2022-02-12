import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Card } from '../models/card';
import { firestore } from "firebase";
import Timestamp = firestore.Timestamp

@Injectable({
    providedIn: 'root',
  })

export class CardsService{
    db: AngularFirestore;

    constructor(_db: AngularFirestore){
        this.db = _db;
    }
    
    async getCards(): Promise<Card[]>{
        return new Promise((resolve, rejects) => {
            this.db.collection('cards').get().subscribe(data => {
                if (!data.empty)
                {
                    let cards: Card[] = [];
                    data.forEach(doc => {
                        let card: Card = doc.data() as Card;
                        card.id = doc.id;
                        cards.push(card);
                    });
                    resolve(cards);
                }
                else{
                    rejects("No cards found.");
                }
            });
        });
    }
    
    async getCard(id: string): Promise<Card>{
        return new Promise((resolve, rejects) => {
            this.db.collection('cards').doc(id).get().subscribe(doc =>{
                if (doc.exists){
                    let card: Card = doc.data() as Card;
                    card.id = doc.id;
                    resolve(card);
                }
                else{
                    rejects("Card not found.");
                }
            });
        });
    }

    async addCard(card: Card): Promise<string>{
        return new Promise(resolve => {
            this.db.collection('cards').add({
                name: card.name,
                description: card.description,
                details: card.details,
                price: card.price,
                event: card.event,
                recipient: card.recipient,
                active: card.active,
                created: Timestamp.now()
            }).then(data => {
                resolve(data.id);
            })
        });
    }

    async updateCard(card: Card): Promise<void>{
        return this.db.collection('cards').doc(card.id).update({
            name: card.name,
            description: card.description,
            details: card.details,
            price: card.price,
            event: card.event,
            recipient: card.recipient,
            active: card.active,
            modified: Timestamp.now()
        });
    }

    async getImages(id: string): Promise<string[]>{
        return new Promise((resolve, rejects) => {
            this.db.collection('cards').doc(id).get().subscribe(doc =>{
                if (doc.exists){
                    let card: Card = doc.data() as Card;
                    resolve(card.images);
                }
                else{
                    rejects("Card not found.");
                }
            });
        });
    }

    async updateImages(id: string, images: string[]){
        this.db.collection('cards').doc(id).update({
            images: images,
            modified: Timestamp.now()
        })
    }

    async getPrimary(id: string): Promise<string>{
        return new Promise((resolve, rejects) => {
            this.db.collection('cards').doc(id).get().subscribe(doc =>{
                if (doc.exists){
                    resolve((doc.data() as Card).primary);
                }
                else{
                    rejects("Card not found.");
                }
            });
        });
    }

    async updatePrimary(id: string, image: string){
        this.db.collection('cards').doc(id).update({
            primary: image,
            modified: Timestamp.now()
        })
    }
}