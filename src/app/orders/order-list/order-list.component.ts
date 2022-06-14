import { StatusService } from './../../services/status.service';
import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';
import { Payment } from 'src/app/models/payment';
import { Status } from 'src/app/models/status';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  paymentService: PaymentService;
  statusService: StatusService;

  status: string[] = [];
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  displayPayments: Payment[] = [];

  initializing: boolean = false;
  withRecords: boolean = false;

  search: string = '';
  stat: string = '';
  gateway: string = '';

  limit: number = 10;
  indexCount: number = 0;
  index: number = 0;
  indexLabel: string = '0';
  nextEnable: boolean = false;
  prevEnable: boolean = false;

  constructor(
    private _paymentService: PaymentService,
    private _statusService: StatusService
  ) {
    this.paymentService = _paymentService;
    this.statusService = _statusService;
  }

  ngOnInit() {
    this.generateFilter();
    this.loadPayment();
  }

  generateFilter() {
    this.statusService.getStatuses().then(statuses => {
      statuses.forEach(status => {
        this.status.push(status.name)
      });
    })
  }

  loadPayment() {
    this.initializing = true;
    this.withRecords = true;

    this.paymentService.getPayments().then(payments => {
      this.payments = payments;
      this.filteredPayments = payments;
      this.setIndexes();
      this.loadIndex(1);

      this.withRecords = true;
      this.initializing = false;
    }).catch(err => {
      this.withRecords = false;
      this.initializing = false;
    })
  }

  setIndexes(){
    if (this.filteredPayments.length > 0){
      this.indexCount = Math.floor(this.filteredPayments.length/this.limit);
      if ((this.filteredPayments.length % this.limit) > 0){
        this.indexCount++;
      }
    }
  }

  loadIndex(index: number){
    this.index = index;
    this.displayPayments = [];
    let start: number = (index * this.limit) - this.limit;
    let end: number = start + this.limit;
    this.indexLabel = (start + 1).toString() + ' - ' + (end>this.filteredPayments.length?this.filteredPayments.length:end).toString() + ' OF ' + this.filteredPayments.length.toString();
    this.displayPayments = this.filteredPayments.slice(start, end);

    this.prevEnable = this.index > 1;
    this.nextEnable = this.index < this.indexCount;
  }

  first(){
    if (this.prevEnable)
      this.loadIndex(1);
  }

  prev(){
    if (this.prevEnable)
      this.loadIndex(this.index - 1);
  }

  next(){
    if (this.nextEnable)
      this.loadIndex(this.index + 1);
  }

  last(){
    if (this.nextEnable)
      this.loadIndex(this.indexCount);
  }

  changeLimit(value){
    this.limit = Number(value.target.value);
    this.setIndexes();
    if (this.index > this.indexCount){
      this.loadIndex(this.indexCount);
    }
    else{
      this.loadIndex(this.index);
    }
  }
  
  onChange(type: string, event: any){
    if (type == 'search'){
      this.search = event.target.value;
    }
    if (type == 'status'){
      this.stat = event.value;
    }
    if (type == 'gateway'){
      this.gateway = event.value;
    }
  }

  clickSearch(){
    console.log(this.search);
    if ((this.search != '') || (this.gateway != '') || (this.stat != '')){
      this.initializing = true;
      this.filteredPayments = [];
      this.displayPayments = [];
      
      this.payments.forEach(payment => {
        let isSearchFound: boolean = false;
        let isGatewayFound: boolean = false;
        let isStatusFound: boolean = false;

        if (this.search != ''){
          if(payment.id.toLowerCase().includes(this.search.toLowerCase())){
            isSearchFound = true;
          }
        }

        if (this.gateway != ''){
          if (payment.gateway.toLowerCase() == this.gateway.toLowerCase()){
            isGatewayFound = true;
          }
        }

        if (this.stat != ''){
          if (payment.status.toLowerCase() == this.stat.toLowerCase()){
            isStatusFound = true;
          }
        }
        
        if(isSearchFound || isGatewayFound || isStatusFound){
          this.filteredPayments.push(payment);
        }
      });

      if (this.filteredPayments.length == 0){
        this.withRecords = false;
      }
      else{
        this.withRecords = true;
        this.setIndexes();
        this.loadIndex(1);
      }

      this.initializing = false;
    }
    else{
      if (this.payments.length != this.filteredPayments.length){
        this.filteredPayments = this.payments;
        if (this.filteredPayments.length == 0){
          this.withRecords = false;
        }
        else{
          this.withRecords = true;
          this.setIndexes();
          this.loadIndex(1);
        }
      }
    }
  }
}
