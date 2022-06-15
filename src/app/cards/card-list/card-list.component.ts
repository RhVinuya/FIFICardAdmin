import { SharedService } from './../../services/shared.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CardsService } from 'src/app/services/cards.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Card } from 'src/app/models/card';
import { PageEvent } from '@angular/material';
import { firestore } from "firebase";
import Timestamp = firestore.Timestamp;
import { copyFileSync } from 'fs';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent implements OnInit {
  service: CardsService;

  cards: Card[] = [];
  filteredCards: Card[] = [];
  displayCards: Card[] = [];

  limit: number = 10;
  indexCount: number = 0;
  index: number = 0;
  indexLabel: string = '0';
  nextEnable: boolean = false;
  prevEnable: boolean = false;

  search: string = '';
  event: string = '';
  recipient: string = '';
  status: string = '';

  shared: SharedService;

  completeCards: Card[];
  length: number;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 20, 50, 100];

  dataSource: MatTableDataSource<Card> = new MatTableDataSource();
  displayedColumns: string[] = ['code', 'name', 'description', 'price', 'event', 'recipient', 'ratings', 'active', 'date', 'action'];
  initalizing: boolean;
  withRecords: boolean;

  listOfEvents: string[] = [];
  listOfRecipients: string[] = [];

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private _service: CardsService,
    private _shared: SharedService,
    private titleService: Title
  ) {
    this.service = _service;
    this.shared = _shared;
    this.initalizing = true;
    this.withRecords = true;
  }

  ngOnInit() {
    this.titleService.setTitle('Fibei Greetings - Cards');

    this.service.getNextCode().then(next => {
      console.log(next);
    })

    this.service.getCards().then(data => {
      this.cards = data;
      this.filteredCards = data;
      this.setIndexes();
      this.loadIndex(1);
      this.generateList();

      this.withRecords = true;
      this.initalizing = false;
    }).catch(reason => {
      this.withRecords = false;
      this.initalizing = false;
    });
  }

  setIndexes() {
    if (this.filteredCards.length > 0) {
      this.indexCount = Math.floor(this.filteredCards.length / this.limit);
      if ((this.filteredCards.length % this.limit) > 0) {
        this.indexCount++;
      }
    }
  }

  loadIndex(index: number) {
    this.index = index;
    this.displayCards = [];
    let start: number = (index * this.limit) - this.limit;
    let end: number = start + this.limit;
    this.indexLabel = (start + 1).toString() + ' - ' + (end > this.filteredCards.length ? this.filteredCards.length : end).toString() + ' OF ' + this.filteredCards.length.toString();
    this.displayCards = this.filteredCards.slice(start, end);

    this.prevEnable = this.index > 1;
    this.nextEnable = this.index < this.indexCount;
  }

  generateList() {
    this.cards.forEach(card => {
      if (card.events){
        card.events.forEach(event => {
          if (this.listOfEvents.indexOf(event.trim()) < 0) {
            this.listOfEvents.push(event.trim());
          }
        })
      }
      if (card.recipients){
        card.recipients.forEach(recipient => {
          if (this.listOfRecipients.indexOf(recipient.trim()) < 0) {
            this.listOfRecipients.push(recipient.trim());
          }
        })
      }
    })
  }

  first() {
    if (this.prevEnable)
      this.loadIndex(1);
  }

  prev() {
    if (this.prevEnable)
      this.loadIndex(this.index - 1);
  }

  next() {
    if (this.nextEnable)
      this.loadIndex(this.index + 1);
  }

  last() {
    if (this.nextEnable)
      this.loadIndex(this.indexCount);
  }

  changeLimit(value) {
    this.limit = Number(value.target.value);
    this.setIndexes();
    if (this.index > this.indexCount) {
      this.loadIndex(this.indexCount);
    }
    else {
      this.loadIndex(this.index);
    }
  }

  onChange(type: string, event: any) {
    if (type == 'search')
      this.search = event.target.value;
    if (type == 'event')
      this.event = event.target.value;
    if (type == 'recipient')
      this.recipient = event.target.value;
    if (type == 'status')
      this.status = event.target.value;
  }

  clickSearch() {
    console.log(this.search, this.event, this.recipient, this.status);

    this.initalizing = true;
    this.withRecords = true;

    if ((this.search != '') || (this.event != '') || (this.recipient != '') || (this.status != '')) {
      this.filteredCards = [];
      this.cards.forEach(card => {
        let isSearchMatch: boolean = false;
        let isEventMatch: boolean = false;
        let isRecipientMatch: boolean = false;
        let isStatus: boolean = false;

        if (this.search) {
          if (card.name)
            if (card.name.toLowerCase().includes(this.search.toLowerCase())) {
              isSearchMatch = true;
            }
          if (card.description)
            if (card.description.toLowerCase().includes(this.search.toLowerCase())) {
              isSearchMatch = true;
            }
          if (card.code)
            if (card.code.toLowerCase().includes(this.search.toLowerCase())) {
              isSearchMatch = true;
            }
        }
        else {
          isSearchMatch = true;
        }

        if (this.event != '') {
          let listOfEvents = card.event.split(',');
          listOfEvents.forEach(_event => {
            if (_event.trim() == this.event.trim()) {
              isEventMatch = true;
            }
          });
        }
        else {
          isEventMatch = true;
        }

        if (this.recipient != '') {
          let listOfRecipients = card.recipient.split(',');
          listOfRecipients.forEach(_recipient => {
            if (_recipient.trim() == this.recipient.trim()) {
              isRecipientMatch = true;
            }
          })
        }
        else {
          isRecipientMatch = true;
        }

        if (this.status != '') {
          if (card.active && (this.status == 'active')) {
            isStatus = true
          }
          if (!card.active && (this.status == 'inactive')) {
            isStatus = true
          }
          if (card.bestseller && (this.status == 'bestseller')) {
            isStatus = true
          }
          if (card.featured && (this.status == 'featured')) {
            isStatus = true
          }
          if (card.signAndSend && (this.status == 'signandsend')) {
            isStatus = true
          }
        }
        else {
          isStatus = true;
        }

        if (isSearchMatch && isEventMatch && isRecipientMatch && isStatus) {
          this.filteredCards.push(card);
        }
      });
      this.setIndexes();
      this.loadIndex(1);
      this.withRecords = this.filteredCards.length > 0;
    }
    else{
      if (this.filteredCards.length != this.cards.length){
        this.filteredCards = this.cards;
        this.setIndexes();
        this.loadIndex(1);  
        this.withRecords = this.filteredCards.length > 0;
      }
    }
    
    this.initalizing = false;
  }
}