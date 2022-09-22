import { Type } from './../../models/type';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar, MatTableDataSource } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { TypeService } from 'src/app/services/type.service';

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: ['./type-list.component.css']
})
export class TypeListComponent implements OnInit {
  service: TypeService;
  snackBar: MatSnackBar;
  eventDialogRef: MatDialogRef<DialogComponent>;
  types: Type[] = [];
  dataSource: MatTableDataSource<Type> = new MatTableDataSource();

  constructor(
    private _service: TypeService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.service = _service;
    this.snackBar = _snackBar;
  }

  ngOnInit() {
    this.loadTypes();
  }

  loadTypes() {
    this.service.getTypes().then(data => {
      this.types = data;
      this.dataSource.data = this.types;
    }).catch(res => {
      this.dataSource.data = this.types;
    });
  }

  addType() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add',
      type: 'Type of Card',
      value: ''
    };

    this.eventDialogRef = this.dialog.open(DialogComponent, dialogConfig);

    this.eventDialogRef.afterClosed().subscribe(data => {
      let type: Type = new Type(data);
      this.service.addType(type).then(id => {
        type.id = id;
        this.types.push(type);
        this.dataSource.data = this.types;
      })
    });
  }

  onActive(type: Type) {
    this.service.updateActive(type).then(() => {
      this.snackBar.open(`Status ${type.active ? 'Active' : 'Inactive'}`, "", {
        duration: 3000
      });
    })
  }

  updateName(type: Type) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Update',
      type: 'Type of Card',
      value: type.name
    };

    this.eventDialogRef = this.dialog.open(DialogComponent, dialogConfig);

    this.eventDialogRef.afterClosed().subscribe(data => {
      if (data) {
        type.name = data[0];
        this.service.updateType(type);
      }
    });
  }
}
