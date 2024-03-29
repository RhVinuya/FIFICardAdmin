import { SignAndSend } from './../models/sign-and-send';
import { Title } from '@angular/platform-browser';
import { Rating } from './../models/rating';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Card } from '../models/card';
import { firestore } from "firebase";
import Timestamp = firestore.Timestamp
import { Config } from '../models/config';
import { sign } from 'crypto';

@Injectable({
    providedIn: 'root',
})

export class CardsService {
    db: AngularFirestore;

    constructor(
        _db: AngularFirestore
    ) {
        this.db = _db;
    }

    async getCards(): Promise<Card[]> {
        return new Promise((resolve, rejects) => {
            this.db.collection('cards', ref => ref.orderBy('code', 'desc')).get().subscribe(data => {
                if (!data.empty) {
                    let cards: Card[] = [];
                    data.forEach(doc => {
                        let card: Card = doc.data() as Card;
                        card.id = doc.id;
                        cards.push(card);
                    });
                    resolve(cards);
                }
                else {
                    rejects("No cards found.");
                }
            });
        });
    }

    async getCard(id: string): Promise<Card> {
        return new Promise((resolve, rejects) => {
            this.db.collection('cards').doc(id).get().subscribe(doc => {
                if (doc.exists) {
                    let card: Card = doc.data() as Card;
                    card.id = doc.id;
                    resolve(card);
                }
                else {
                    rejects("Card not found.");
                }
            });
        });
    }

    async addCard(card: Card): Promise<string> {
        return new Promise(resolve => {
            this.getNextCode().then(nextCode => {
                this.db.collection('cards').add({
                    code: nextCode.toString(),
                    name: card.name.trim(),
                    types: card.types,
                    description: card.description.trim(),
                    details: card.details.trim(),
                    price: Number(card.price),
                    event: card.event,
                    events: card.events,
                    recipient: card.recipient,
                    recipients: card.recipients,
                    active: card.active,
                    bestseller: card.bestseller,
                    featured: card.featured,
                    ratings: Number(0),
                    created: Timestamp.now(),
                    search_name: card.name.trim().toLowerCase(),
                    search_description: card.description.trim().toLocaleLowerCase()
                }).then(data => {
                    resolve(data.id);
                })
            })
        });
    }

    async updateCard(card: Card): Promise<void> {
        return this.db.collection('cards').doc(card.id).update({
            //code: card.code,
            name: card.name.trim(),
            types: card.types,
            description: card.description.trim(),
            details: card.details.trim(),
            price: Number(card.price),
            event: card.event,
            events: card.events,
            recipient: card.recipient,
            recipients: card.recipients,
            active: card.active,
            bestseller: card.bestseller,
            featured: card.featured,
            modified: Timestamp.now(),
            search_name: card.name.trim().toLowerCase(),
            search_description: card.description.trim().toLocaleLowerCase()
        });
    }

    async updateNewCode(id: string, code: string): Promise<void> {
        return this.db.collection('cards').doc(id).update({
            code: code,
            modified: Timestamp.now()
        });
    }

    async deleteCard(id: string) {
        this.db.collection('cards').doc(id).delete();
    }

    async getCardByName(name: string): Promise<string> {
        return new Promise((resolve, rejects) => {
            this.db.collection('cards', ref => ref.where("name", "==", name)).get().subscribe(data => {
                if (!data.empty) {
                    data.forEach(doc => {
                        resolve(doc.id);
                    });
                }
                else {
                    rejects("Card not found.");
                }
            });
        })

    }

    async getImages(id: string): Promise<string[]> {
        return new Promise((resolve, rejects) => {
            this.db.collection('cards').doc(id).get().subscribe(doc => {
                if (doc.exists) {
                    let card: Card = doc.data() as Card;
                    resolve(card.images);
                }
                else {
                    rejects("Card not found.");
                }
            });
        });
    }

    async updateImages(id: string, images: string[]) {
        this.db.collection('cards').doc(id).update({
            images: images,
            modified: Timestamp.now()
        })
    }

    async getPrimary(id: string): Promise<string> {
        return new Promise((resolve, rejects) => {
            this.db.collection('cards').doc(id).get().subscribe(doc => {
                if (doc.exists) {
                    resolve((doc.data() as Card).primary);
                }
                else {
                    rejects("Card not found.");
                }
            });
        });
    }

    async updatePrimary(id: string, image: string) {
        this.db.collection('cards').doc(id).update({
            primary: image,
            modified: Timestamp.now()
        })
    }

    async updateStatus(id: string, status: boolean) {
        this.db.collection('cards').doc(id).update({
            active: status,
            modified: Timestamp.now()
        })
    }

    async deactivate(id: string) {
        this.db.collection('cards').doc(id).update({
            active: false,
            modified: Timestamp.now()
        })
    }

    async updateSignAndSendFlag(id: string, value: boolean) {
        this.db.collection('cards').doc(id).update({
            signAndSend: value
        })
    }

    async getNextCode(): Promise<number> {
        return new Promise((resolve, rejects) => {
            this.db.collection('settings').doc('code').get().subscribe(doc => {
                if (doc.exists) {
                    let newCode: number = Number(doc.data().nextcode) + 1;
                    this.updateNexCode(newCode).then(() => {
                        resolve(Number(doc.data().nextcode));
                    });
                }
            });
        });
    }

    async updateNexCode(newCode: Number): Promise<void> {
        return this.db.collection('settings').doc('code').update({
            nextcode: newCode
        })
    }

    async updateAverageRatings(id: string, ratings: number) {
        this.db.collection('cards').doc(id).update({
            ratings: Number(ratings),
            modified: Timestamp.now()
        })
    }

    async getRatings(id: string): Promise<Rating[]> {
        return new Promise((resolve, rejects) => {
            this.db.collection('cards').doc(id).collection('ratings', ref => ref.orderBy('created', 'desc')).get().subscribe(data => {
                if (!data.empty) {
                    let ratings: Rating[] = [];
                    data.forEach(doc => {
                        let rating: Rating = doc.data() as Rating;
                        rating.id = doc.id;
                        rating.date = doc.data()["date"].toDate();
                        ratings.push(rating);
                    });
                    resolve(ratings);
                }
                else {
                    rejects("No ratings found.");
                }
            });
        });
    }

    async addRating(id: string, rating: Rating): Promise<string> {
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

    async UpdateRating(id: string, rating: Rating): Promise<void> {
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

    async getSignAndSend(id: string, image: string): Promise<SignAndSend[]> {
        return new Promise((resolve, rejects) => {
            this.db.collection('cards').doc(id).collection('signandsend').get().subscribe(data => {
                if (!data.empty) {
                    let signAndSends: SignAndSend[] = [];
                    data.forEach(doc => {
                        let signAndSend: SignAndSend = doc.data() as SignAndSend;
                        if (signAndSend.image == image) {
                            signAndSend.id = doc.id;
                            signAndSends.push(signAndSend);
                        }
                    });
                    if (signAndSends.length > 0)
                        resolve(signAndSends);
                    else
                        rejects("No Sign and Send Detail found.");
                }
                else {
                    rejects("No Sign and Send Detail found.");
                }
            });
        });
    }

    async addSignAndSend(id: string, sign: SignAndSend): Promise<string> {
        return new Promise(resolve => {
            this.db.collection('cards').doc(id).collection('signandsend').add({
                image: sign.image,
                code: sign.code,
                left: sign.left,
                top: sign.top,
                width: sign.width,
                height: sign.height,
                limit: sign.limit,
            }).then(data => {
                resolve(data.id);
            })
        });
    }

    async updateSignAndSend(id: string, sign: SignAndSend): Promise<void> {
        return this.db.collection('cards').doc(id).collection('signandsend').doc(sign.id).update({
            left: sign.left,
            top: sign.top,
            width: sign.width,
            height: sign.height,
            limit: sign.limit,
        });
    }

    async deleteSignAndSend(id: string, signId: string) {
        return this.db.collection('cards').doc(id).collection('signandsend').doc(signId).delete();
    }

    async getSignAndSendCount(id: string): Promise<number> {
        return new Promise((resolve, rejects) => {
            this.db.collection('cards').doc(id).collection('signandsend').get().subscribe(data => {
                if (!data.empty) {
                    resolve(data.docs.length);
                }
                else {
                    resolve(0);
                }
            });
        });
    }
}