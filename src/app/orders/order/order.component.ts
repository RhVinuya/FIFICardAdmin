import { EmailService } from './../../services/email.service';
import { MatSnackBar } from '@angular/material';
import { UploadService } from './../../services/upload.service';
import { UploadComponent } from './../../cards/upload/upload.component';
import { OrdersService } from './../../services/orders.service';
import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { ActivatedRoute } from '@angular/router';
import { EmailValidator, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  activateRoute: ActivatedRoute;
  service: OrdersService;
  uploadService: UploadService;
  emailService: EmailService;
  fb: FormBuilder;
  id?: string;
  order: Order;
  image: string;
  statusForm: FormGroup;
  snackBar: MatSnackBar;

  constructor(
    private _activateRoute: ActivatedRoute,
    private _service: OrdersService,
    private _uploadService: UploadService,
    private _emailService: EmailService,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) { 
    this.service = _service;
    this.activateRoute = _activateRoute;
    this.uploadService = _uploadService;
    this.emailService = _emailService;
    this.fb = _fb;
    this.snackBar = _snackBar;
  }

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
      this.loadOrder(this.id);
    });

    this.statusForm = this.fb.group({
      status: ['', [Validators.required]]
    })
  }

  loadOrder(id: string){
    this.service.getOrder(id).then(data => {
        this.order = data;
        this.statusForm = this.fb.group({
          status: data.status
        });
        this.uploadService.getDownloadURL(data.proof).then(url => {
          this.image = url;
          console.log(this.image);
        });
        console.log(this.order);
    });
  }

  updateStatus(){
    if (this.statusForm.valid){
      let status = this.statusForm.value['status'];
      this.order.status = status;
      this.service.updateStatus(this.order.id, status).then(() => this.snackBar.open("Status is updated to: " + status, '', { duration: 3000, }));
    }
  }

  emailStatus(){
    this.emailService.sendOrderEmail(this.order);
    this.snackBar.open("Email has been sent", '', { duration: 3000, });
  }

}
