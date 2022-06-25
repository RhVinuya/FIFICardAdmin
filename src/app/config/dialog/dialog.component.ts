import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  type: string;
  value: string;

  constructor(
    private fb: FormBuilder,
    private eventDialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.type = data.type;
    this.value = data.value;
  }

  ngOnInit() {}
    

  change(event: any){
    this.type = event.target.value;
  }

  save() {
    if (this.type != ''){
      this.eventDialogRef.close(this.type);
    }
  }

  close() {
    this.eventDialogRef.close();
  }
}
