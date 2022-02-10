import { UsersService } from './../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { NotificationService } from '../../core/services/notification.service';
import { NGXLogger } from 'ngx-logger';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  service: UsersService;

  users: User[];
  displayedColumns: string[] = ['name', 'email', 'active', 'action'];
  initalizing: boolean;
  withRecords: boolean;

  constructor(
    private _service: UsersService,
    private logger: NGXLogger,
    private notificationService: NotificationService,
    private titleService: Title
  ) { 
    this.service = _service;
    this.initalizing = true;
    this.withRecords = true;
  }

  ngOnInit() {
    this.titleService.setTitle('Fifi Greetings - Users');
    this.logger.log('Users loaded');

    this.service.getUsers().then(data => {
      if (data.length > 0)
      {
        this.users = data;
        this.withRecords = true;
      }
      else{
        this.withRecords = false;
      }
      this.initalizing = false;
    }).catch(reason =>{
      this.withRecords = false;
      this.initalizing = false;
    });
  }
}
