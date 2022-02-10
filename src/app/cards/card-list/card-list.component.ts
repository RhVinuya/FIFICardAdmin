import { Component, OnInit, ViewChild } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Title } from '@angular/platform-browser';
import { CardsService } from 'src/app/services/cards.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Card } from 'src/app/models/card';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent implements OnInit {
  service: CardsService;

  cards: Card[];
  displayedColumns: string[] = ['name', 'description', 'details', 'price', 'active', 'action'];
  initalizing: boolean;
  withRecords: boolean;

  constructor(private _service: CardsService,
    private logger: NGXLogger,
    private titleService: Title) {
    this.service = _service;
    this.initalizing = true;
    this.withRecords = true;
  }

  ngOnInit() {
    this.titleService.setTitle('Fifi Greetings - Cards');
    this.logger.log('Cards loaded');

    this.service.getCards().then(data => {
      if (data.length > 0)
      {
        this.cards = data;
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
