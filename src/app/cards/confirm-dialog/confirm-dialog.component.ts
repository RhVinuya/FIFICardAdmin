import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  message: string;

  constructor(
    private confirmDialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) { 
    confirmDialogRef.disableClose = true;
  }

  ngOnInit() {
    this.message = this.data.message;
  }

  clickYes(){
    this.confirmDialogRef.close(true);
  }

  clickNo(){
    this.confirmDialogRef.close(false);
  }

}
