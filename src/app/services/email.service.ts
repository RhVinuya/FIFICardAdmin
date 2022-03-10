import { CardsService } from 'src/app/services/cards.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Order } from '../models/order';
import { UploadService } from './upload.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  db: AngularFirestore;
  cardService: CardsService;
  uploadService: UploadService;

  constructor(
    private _db: AngularFirestore,
    private _cardService: CardsService,
    private _uploadService: UploadService
  ) { 
    this.db = _db;
    this.cardService = _cardService;
    this.uploadService = _uploadService;
  }

  private async generateHTML(order: Order, url: string): Promise<string>{
    return new Promise((resolve, rejects) => {
      fetch('/assets/static/order.html').then(res => res.text()).then(data => {
        let html = data;
        html = html.replace('[STATUS]', order.status!);
        html = html.replace('[SenderName]', order.sender_name!);
        html = html.replace('[SenderPhone]', order.sender_phone!);
        html = html.replace('[SenderEmail]', order.sender_email!);
        html = html.replace('[ReceiverName]', order.receiver_name!);
        html = html.replace('[ReceiverPhone]', order.receiver_phone!);
        html = html.replace('[ReceiverEmail]', order.receiver_email!);
        html = html.replace('[MESSAGE]', order.message!);
        html = html.replace('[CARDIMAGE]', url == ''? 'http://via.placeholder.com/550x360' : url);
        html = html.replace('[OrderDetails]', 'https://fifigreetings.com/status/' + order.id);
        resolve(html);
      }).catch(reason => {
        rejects(reason);
      })
    });
  }

  private async getCard(id: string): Promise<string>{
    return new Promise((resolve, rejects) => {
      this.cardService.getCard(id).then(card => {
        let primary: string = card.primary!;
        if ((!primary) || (primary == '')){
          resolve(card.images![0]);
        }
        else{
          resolve(primary);
        }
        
      })  
    });
  }

  sendOrderEmail(order: Order){
    this.getCard(order.card_id!).then(primary => {
      this.uploadService.getDownloadURL(primary).then(url => {
        this.generateHTML(order, url).then(html => {
          this.db.collection('mail').add({
            to: order.sender_email,
            message: {
              subject: "Fifi Greetings Order Update",
              html: html,
            },
          });
        });
      });
    })    
  }
}
