import { Title } from '@angular/platform-browser';
import { Rating } from './../models/rating';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Card } from '../models/card';
import { firestore } from "firebase";
import Timestamp = firestore.Timestamp
import { Config } from '../models/config';

@Injectable({
    providedIn: 'root',
  })

export class CardsService{
    db: AngularFirestore;

    constructor(
        _db: AngularFirestore
    ){
        this.db = _db;
    }
    
    async getCards(): Promise<Card[]>{
        return new Promise((resolve, rejects) => {
            this.db.collection('cards', ref => ref.orderBy('code', 'desc')).get().subscribe(data => {
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
            this.getNextCode().then(nextCode => {
                this.db.collection('cards').add({
                    code: nextCode.toString(),
                    name: card.name,
                    description: card.description,
                    details: card.details,
                    price: card.price,
                    event: card.event,
                    events: card.events,
                    recipient: card.recipient,
                    active: card.active,
                    created: Timestamp.now()
                }).then(data => {
                    resolve(data.id);
                })
            })
        });
    }

    async updateCard(card: Card): Promise<void>{
        return this.db.collection('cards').doc(card.id).update({
            //code: card.code,
            name: card.name,
            description: card.description,
            details: card.details,
            price: card.price,
            event: card.event,
            events: card.events,
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

    async deactivate(id: string){
        this.db.collection('cards').doc(id).update({
            active: false,
            modified: Timestamp.now()
        })
    }

    async getNextCode(): Promise<number>{
        return new Promise((resolve, rejects) => {
            this.db.collection('cards', ref => ref.orderBy('code', 'desc')).get().subscribe(data => {
                if (!data.empty)
                {
                    data.forEach(doc => {
                        let lastCard: Card = doc.data() as Card;
                        resolve(Number(lastCard.code) + 1);
                        return;
                    })

                }
                else{
                    resolve(100000);
                }
            });
        });
    }

    async updateAverageRatings(id: string, ratings: number){
        this.db.collection('cards').doc(id).update({
            ratings: ratings,
            modified: Timestamp.now()
        })
    }

    async getRatings(id: string): Promise<Rating[]>{
        return new Promise((resolve, rejects) => {
            this.db.collection('cards').doc(id).collection('ratings', ref => ref.orderBy('created', 'desc')).get().subscribe(data => {
                if (!data.empty)
                {
                    let ratings: Rating[] = [];
                    data.forEach(doc => {
                        //console.log(doc.data()["date"].toDate());
                        let rating: Rating = doc.data() as Rating;
                        rating.id = doc.id;
                        rating.date = doc.data()["date"].toDate();
                        ratings.push(rating);
                    });
                    resolve(ratings);
                }
                else{
                    rejects("No ratings found.");
                }
            });
        });
    }

    async addRating(id: string, rating: Rating): Promise<string>{
        return new Promise(resolve => {
            this.db.collection('cards').doc(id).collection('ratings').add({
                date: new Date(rating.date),
                username: rating.username,
                rate: rating.rate,
                title: rating.title,
                review: rating.review,
                approve: rating.approve,
                created: Timestamp.now()
            }).then(data => {
                resolve(data.id);
            })
        });
    }

    async UpdateRating(id: string, rating: Rating): Promise<void>{
        return this.db.collection('cards').doc(id).collection('ratings').doc(rating.id).update({
            date: new Date(rating.date),
            username: rating.username,
            rate: rating.rate,
            title: rating.title,
            review: rating.review,
            approve: rating.approve,
            modified: Timestamp.now()
        });
    }
}