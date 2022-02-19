import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  form: FormGroup;
  type: string;

  constructor(
    private fb: FormBuilder,
    private eventDialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.type = data.type;
  }

  ngOnInit() {
    this.form = this.fb.group({
      label: ['', [Validators.required]]
    });
  }

  save() {
    if (this.form.valid){
      this.eventDialogRef.close(this.form.value);
    }
  }

  close() {
    this.eventDialogRef.close();
  }

}
