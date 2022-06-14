import { PaymentService } from 'src/app/services/payment.service';
import { Validators } from '@angular/forms';
import { Status } from 'src/app/models/status';
import { StatusService } from './../../services/status.service';
import { UploadService } from './../../services/upload.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Payment } from 'src/app/models/payment';

@Component({
  selector: 'app-payment-status-dialog',
  templateUrl: './payment-status-dialog.component.html',
  styleUrls: ['./payment-status-dialog.component.css']
})
export class PaymentStatusDialogComponent implements OnInit {
  payment: Payment;
  uploadService: UploadService;
  statusService: StatusService;
  paymentService: PaymentService;
  snackBar: MatSnackBar
  proof: string = '';
  statuses: Status[] = [];
  status: string;

  constructor(
    private _uploadService: UploadService,
    private _statusService: StatusService,
    private _paymentService: PaymentService,
    private _snackBar: MatSnackBar,
    private signAndSendDialogRef: MatDialogRef<PaymentStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { payment: Payment }
  ) { 
    signAndSendDialogRef.disableClose = true;
    this.uploadService = _uploadService;
    this.statusService = _statusService;
    this.paymentService = _paymentService;
    this.snackBar = _snackBar;
  }

  ngOnInit() {
    this.payment = this.data.payment;
    this.status = this.payment.status;
    if (this.payment.gateway == 'GCash'){
      this.uploadService.getDownloadURL(this.payment.proof).then(url => {
        console.log(this.payment.proof, url);
        this.proof = url;
      })
    }
    this.getStatuses();
  }

  getStatuses(){
    this.statusService.getStatuses().then(data => {
      this.statuses = data;
    })
  }

  onChange(event: any){
    this.status = event.value;
  }

  save(){
    this.payment.status = this.status;
    this.paymentService.updateStatus(this.payment.id, this.status);
    this.snackBar.open("Payment Status Updated", "", { duration: 3000 });
  }

  close() {
    this.signAndSendDialogRef.close({payment: this.payment});
  }

}
