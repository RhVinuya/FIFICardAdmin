import { Occasion } from './../../models/occasion';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar, MatTableDataSource } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})

export class EventListComponent implements OnInit {
  service: EventService;
  snackBar: MatSnackBar;
  eventDialogRef: MatDialogRef<DialogComponent>;
  occasions: Occasion[] = [];
  dataSource: MatTableDataSource<Occasion> = new MatTableDataSource();

  constructor(
    private _service: EventService,
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
    this.service.getEvents().then(data => {
      this.occasions = data;
      this.dataSource.data = this.occasions;
    }).catch(res => {
      this.dataSource.data = this.occasions;
    });
  }

  addEvent(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      type: 'Event'
    };

    this.eventDialogRef = this.dialog.open(DialogComponent, dialogConfig);

    this.eventDialogRef.afterClosed().subscribe(data => {
      let occasion: Occasion = new Occasion(data.label);
      this.service.addEvent(occasion).then(id => {
        occasion.id = id;
        this.occasions.push(occasion);
        this.dataSource.data = this.occasions;
      })
    });    
  }

  onActive(ocassion: Occasion){
    this.service.updateActive(ocassion).then(()=> {
      this.snackBar.open(`Event ${ocassion.active? 'Active' : 'Inactive'}`, "", {
        duration: 3000
      });
    })
  }

  onIsGift(ocassion: Occasion){
    this.service.updateIsGift(ocassion).then(()=> {
      this.snackBar.open(`Event ${ocassion.active? 'Active' : 'Inactive'}`, "", {
        duration: 3000
      });
    })
  }
}
