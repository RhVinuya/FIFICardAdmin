import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  action: string;
  type: string;
  value: string;

  constructor(
    private fb: FormBuilder,
    private eventDialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.action = data.action;
    this.type = data.type;
    this.value = data.value;
  }

  ngOnInit() { }


  change(event: any) {
    this.value = event.target.value;
  }

  save() {
    if (this.value != '') {
      this.eventDialogRef.close(this.value);
    }
  }

  close() {
    this.eventDialogRef.close();
  }
}
