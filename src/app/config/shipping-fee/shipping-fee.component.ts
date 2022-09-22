import { ShippingService } from './../../services/shipping.service';
import { Fee } from './../../models/fee';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-shipping-fee',
  templateUrl: './shipping-fee.component.html',
  styleUrls: ['./shipping-fee.component.css']
})
export class ShippingFeeComponent implements OnInit {
  fees: Fee[] = [];
  shippingService: ShippingService;
  snackBar: MatSnackBar;
  isSaving: boolean = false;

  constructor(
    _shippingService: ShippingService,
    _snackBar: MatSnackBar
  ) {
    this.shippingService = _shippingService;
    this.snackBar = _snackBar;
  }

  ngOnInit() {
    this.loadShippingFee();
  }

  loadShippingFee() {
    this.shippingService.getShippingFees().then(fees => {
      this.fees = fees;
    }).catch(err => {
      this.fees.push(new Fee('Card'));
      this.fees.push(new Fee('Gift'));
      this.fees.push(new Fee('Sticker'));
      this.fees.push(new Fee('Creation'));
    })
  }

  updateFee(event: Fee) {
    let index: number = this.fees.findIndex(x => x.name == event.name);
    if (index < 0) {
      this.fees[index].metromanila = event.metromanila;
      this.fees[index].luzon = event.luzon;
      this.fees[index].visayas = event.visayas;
      this.fees[index].mindanao = event.mindanao;
    }
  }

  updateClick() {
    this.isSaving = true;
    this.fees.forEach(fee => {
      if (fee.id == undefined) {
        this.shippingService.addShippingFee(fee).then(id => {
          fee.id = id;
        })
      }
      else {
        this.shippingService.updateShippingFee(fee);
      }
    })
    this.isSaving = false;
    this.snackBar.open("Shipping Fee Saved", "", { duration: 3000 });
  }
}
