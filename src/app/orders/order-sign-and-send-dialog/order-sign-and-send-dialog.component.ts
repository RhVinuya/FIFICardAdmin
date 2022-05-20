import { UploadService } from './../../services/upload.service';
import { CardsService } from 'src/app/services/cards.service';
import { SignAndSendDetails } from './../../models/sign-and-send-details';
import { OrdersService } from 'src/app/services/orders.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

class Image{
  public image: string;
  public url: string;
}

@Component({
  selector: 'app-order-sign-and-send-dialog',
  templateUrl: './order-sign-and-send-dialog.component.html',
  styleUrls: ['./order-sign-and-send-dialog.component.css']
})
export class OrderSignAndSendDialogComponent implements OnInit {
  id: string;

  service: OrdersService;
  uploadService: UploadService;
  items: SignAndSendDetails[] = []
  images: Image[] = [];
  focus: Image = new Image();
  focusItems: SignAndSendDetails[] = []

  constructor(
    _service: OrdersService,
    _uploadService: UploadService,
    private signAndSendDialogRef: MatDialogRef<OrderSignAndSendDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { orderId: string }
  ) { 
    this.service = _service;
    this.uploadService = _uploadService;
  }

  ngOnInit() {
    this.id = this.data.orderId;
    this.service.getSignAndSendDetails(this.id).then(data => {
      this.items = data;
      this.items.forEach(item => {
        if (!this.images.find(x => x.image == item.image)){
          let image: Image = new Image();
          image.image = item.image;
          this.images.push(image);
        }
      });
      
      this.images.forEach(image => {
        this.uploadService.getDownloadURL(image.image).then(url => {
          this.images.find(x=> x.image == image.image).url = url;
        })
      })

      this.focus = this.images[0];
      this.loadLayout(this.focus);
    });
  }

  changeImage(image: Image){
    if (this.focus.image != image.image){
      this.focus = image;
      this.loadLayout(this.focus);
    }
  }

  loadLayout(image: Image){
    this.focusItems = [];
    this.items.forEach(item => {
      if (item.image == image.image){
        this.focusItems.push(item);
      }
    })
  }

  close() {
    this.signAndSendDialogRef.close();
  }

  save(){
    
  }
}
