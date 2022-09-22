import { Type, TypeUpgrade } from './../../../models/type';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-upgrade-dialog',
  templateUrl: './upgrade-dialog.component.html',
  styleUrls: ['./upgrade-dialog.component.css']
})
export class UpgradeDialogComponent implements OnInit {

  types: Type[] = [];
  upgrade: TypeUpgrade = new TypeUpgrade();

  constructor(
    private fb: FormBuilder,
    private eventDialogRef: MatDialogRef<UpgradeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.types = data.types;
    if (data.upgrade) {
      this.upgrade = data.upgrade;
    }
  }

  ngOnInit() {
  }

  save() {
    this.eventDialogRef.close(this.upgrade);
  }

  close() {
    this.eventDialogRef.close();
  }

}
