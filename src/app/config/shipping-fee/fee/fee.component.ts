import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Fee } from 'src/app/models/fee';

@Component({
  selector: 'app-fee',
  templateUrl: './fee.component.html',
  styleUrls: ['./fee.component.css']
})
export class FeeComponent implements OnInit {
  @Input() fee: Fee;
  @Output() updateFee: EventEmitter<Fee> = new EventEmitter<Fee>();

  constructor() {}

  ngOnInit() {}

  onKeyPressEvent(event: any){
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 46) {
      return true;
    }
    else if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  onChangeEvent(type: string, event: any){
    if (type == 'metromanila'){
      this.fee.metromanila = Number(event.target.value);
    }
    if (type == 'luzon'){
      this.fee.luzon = Number(event.target.value);
    }
    if (type == 'visayas'){
      this.fee.visayas = Number(event.target.value);
    }
    if (type == 'mindanao'){
      this.fee.mindanao = Number(event.target.value);
    }

    this.updateFee.emit(this.fee);
  }
}
