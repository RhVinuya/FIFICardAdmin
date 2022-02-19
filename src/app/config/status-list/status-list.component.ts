import { StatusService } from './../../services/status.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar, MatTableDataSource } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { Status } from 'src/app/models/status';
import { stat } from 'fs';

@Component({
  selector: 'app-status-list',
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.css']
})
export class StatusListComponent implements OnInit {
  service: StatusService;
  snackBar: MatSnackBar;
  eventDialogRef: MatDialogRef<DialogComponent>;
  statuses: Status[] = [];
  dataSource: MatTableDataSource<Status> = new MatTableDataSource();

  constructor(
    private _service: StatusService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { 
    this.service = _service;
    this.snackBar = _snackBar;
  }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents(){
    this.service.getStatuses().then(data => {
      this.statuses = data;
      this.dataSource.data = this.statuses;
    }).catch(res => {
      this.dataSource.data = this.statuses;
    });
  }

  addEvent(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      type: 'Status'
    };

    this.eventDialogRef = this.dialog.open(DialogComponent, dialogConfig);

    this.eventDialogRef.afterClosed().subscribe(data => {
      let status: Status = new Status(data.label);
      this.service.addStatus(status).then(id => {
        status.id = id;
        this.statuses.push(status);
        this.dataSource.data = this.statuses;
      })
    });    
  }

  onActive(status: Status){
    this.service.updateActive(status).then(()=> {
      this.snackBar.open(`Status ${status.active? 'Active' : 'Inactive'}`, "", {
        duration: 3000
      });
    })
  }

  onInitialChange(id: string)
  {
    this.statuses.forEach(data => {
      if (data.id == id){
        data.initial = true;
        this.service.updateInitial(data).then(() => {
          this.snackBar.open('Status updated', "", {
            duration: 3000
          });
        })
      }
      else{
        if (data.initial){
          data.initial = false;
          this.service.updateInitial(data).then();
        }
      }
    });
  }

}
