import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar, MatTableDataSource } from '@angular/material';
import { Recipient } from 'src/app/models/recipient';
import { RecipientService } from 'src/app/services/recipient.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-recipient-list',
  templateUrl: './recipient-list.component.html',
  styleUrls: ['./recipient-list.component.css']
})
export class RecipientListComponent implements OnInit {
  service: RecipientService;
  snackBar: MatSnackBar;
  eventDialogRef: MatDialogRef<DialogComponent>;
  recipients: Recipient[] = [];
  dataSource: MatTableDataSource<Recipient> = new MatTableDataSource();

  constructor(
    private _service: RecipientService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.service = _service;
    this.snackBar = _snackBar;
  }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.service.getRecipients().then(data => {
      this.recipients = data;
      this.dataSource.data = this.recipients;
    }).catch(res => {
      this.dataSource.data = this.recipients;
    });
  }

  addEvent() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add',
      type: 'Recipient',
      value: ''
    };

    this.eventDialogRef = this.dialog.open(DialogComponent, dialogConfig);

    this.eventDialogRef.afterClosed().subscribe(data => {
      let recipient: Recipient = new Recipient(data);
      this.service.addRecipient(recipient).then(id => {
        recipient.id = id;
        this.recipients.push(recipient);
        this.dataSource.data = this.recipients;
      })
    });
  }

  onActive(recipient: Recipient) {
    this.service.updateActive(recipient).then(() => {
      this.snackBar.open(`Recipient ${recipient.active ? 'Active' : 'Inactive'}`, "", {
        duration: 3000
      });
    })
  }

  updateName(recipient: Recipient) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Update',
      type: 'Recipient',
      value: recipient.name
    };

    this.eventDialogRef = this.dialog.open(DialogComponent, dialogConfig);

    this.eventDialogRef.afterClosed().subscribe(data => {
      if (data) {
        recipient.name = data;
        this.service.updateName(recipient);
      }
    });
  }

}
