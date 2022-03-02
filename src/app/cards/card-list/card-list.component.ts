import { Status } from './../../models/status';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Title } from '@angular/platform-browser';
import { CardsService } from 'src/app/services/cards.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Card } from 'src/app/models/card';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { firestore } from "firebase";
import Timestamp = firestore.Timestamp;

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent implements OnInit {
  service: CardsService;

  fb: FormBuilder;
  searchForm: FormGroup;

  completeCards: Card[];
  cards: Card[];
  length: number;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 20, 50, 100];

  dataSource: MatTableDataSource<Card> = new MatTableDataSource();
  displayedColumns: string[] = ['code', 'name', 'description', 'price', 'event', 'recipient', 'active', 'date', 'action'];
  initalizing: boolean;
  withRecords: boolean;

  listOfEvents: string[] = [];
  listOfRecipients: string[] = [];

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private _service: CardsService,
    private _fb: FormBuilder,
    private logger: NGXLogger,
    private titleService: Title) {
    this.service = _service;
    this.fb = _fb;
    this.initalizing = true;
    this.withRecords = true;
  }

  ngOnInit() {
    this.titleService.setTitle('Fifi Greetings - Cards');
    this.logger.log('Cards loaded');

    this.service.getCards().then(data => {
      this.completeCards = data;
      this.loadData(data);
      this.generateLists(data);
    }).catch(reason => {
      //this.withRecords = false;
      this.initalizing = false;
    });

    this.searchForm = this.fb.group({
      search: [null],
      event: ['All'],
      recipient: ['All'],
      status: ['All']
    })
  }

  loadData(data: Card[]) {
    if (data.length > 0) {
      this.cards = data;
      this.length = this.cards.length;
      this.pageIndex = 0;
      this.updateRange();
      this.withRecords = true;
    }
    else {
      this.length = 0;
      this.pageIndex = 0;
      this.withRecords = false;
    }
    this.initalizing = false;
  }

  generateLists(data: Card[]) {
    data.forEach(card => {
      let events = card.event.split(',');
      events.forEach(event => {
        this.addListOfEvent(event.trim());
      });

      let recipients = card.recipient.split(',');
      recipients.forEach(recipient => {
        this.addListOfRecipient(recipient.trim());
      });
    })
  }

  addListOfEvent(_event: string) {
    if ((_event != '') && (_event.toLocaleLowerCase() != 'all')) {
      let isFound: boolean = false;
      this.listOfEvents.forEach(event => {
        if (event == _event) {
          isFound = true;
        }
      });

      if (!isFound) {
        this.listOfEvents.push(_event);
      }
    }
  }

  addListOfRecipient(_recipient: string) {
    if ((_recipient != '') && (_recipient.toLocaleLowerCase() != 'all')) {
      let isFound: boolean = false;
      this.listOfRecipients.forEach(recipient => {
        if (recipient == _recipient) {
          isFound = true;
        }
      });

      if (!isFound) {
        this.listOfRecipients.push(_recipient);
      }
    }
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (sort.direction != '') {
      this.dataSource.data = data.sort((a, b) => {
        const isAsc = sort.direction === "asc";
        switch (sort.active) {
          case "name":
            return compare(a.name, b.name, isAsc);
          case "description":
            return compare(a.description, b.description, isAsc);
          case "price":
            return compareNumber(a.price, b.price, isAsc);
          case "event":
            return compare(a.event, b.event, isAsc);
          case "recipient":
            return compare(a.recipient, b.recipient, isAsc);
          case "active":
            return compareBoolean(a.active, b.active, isAsc);
          case "date":
            return compareDate(a.modified ? a.modified : a.created, b.modified ? b.modified : b.created, isAsc)
          default:
            return 0;
        }
      });
    }
  }

  searchCard() {
    let search: string = this.searchForm.value['search'];
    let event: string = this.searchForm.value['event'];
    let recipient: string = this.searchForm.value['recipient'];
    let status: string = this.searchForm.value['status'];

    this.initalizing = true;
    this.withRecords = true;

    if ((!search) && (event == 'All') && (recipient == 'All') && (status == 'All'))
    {
      this.loadData(this.completeCards);
      this.initalizing = false;
      this.withRecords = this.cards.length > 0;
    }
    else 
    {
      this.service.getCards().then(data => {
        let newCards: Card[] = [];
        data.forEach(card => {
          let isIncluded = false;

          if (search) {
            if (card.name.includes(search)) {
              isIncluded = true;
            }
            if (card.description.includes(search)) {
              isIncluded = true;
            }
          }
          else {
            isIncluded = true;
          }

          if (isIncluded) {
            if (event != 'All') {
              let listOfEvents = card.event.split(',');
              let found: boolean = false;
              listOfEvents.forEach(_event => {
                if (_event.trim() == event.trim()) {
                  found = true;
                }
              })
              if (!found) {
                isIncluded = false;
              }
            }
          }

          if (isIncluded) {
            if (recipient != 'All') {
              let listOfRecipients = card.recipient.split(',');
              let found: boolean = false;
              listOfRecipients.forEach(_recipient => {
                if (_recipient.trim() == recipient.trim()) {
                  found = true;
                }
              })
              if (!found) {
                isIncluded = false;
              }
            }
          }

          if (isIncluded) {
            if (status != 'All') {
              if (card.active && (status != 'active')) {
                isIncluded = false
              }
              if (!card.active && (status != 'inactive')) {
                isIncluded = false
              }
            }
          }

          if (isIncluded) {
            newCards.push(card);
          }
        });
        this.loadData(newCards);
      }).catch(reason => {
        this.withRecords = false;
        this.initalizing = false;
      });
    }
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateRange();
  }

  updateRange() {
    let start: number = this.pageIndex * this.pageSize;
    let end: number = start + this.pageSize;
    let selectedCards: Card[] = [];
    for (let i = start; i < end; i++) {
      if (this.cards[i]) {
        selectedCards.push(this.cards[i]);
      }
    }
    this.dataSource.data = selectedCards;
  }
}

function compare(a: string, b: string, isAsc: boolean) {
  if ((a != undefined) && (b != undefined)) {
    return (a.trim() < b.trim() ? -1 : 1) * (isAsc ? 1 : -1);
  }
  if ((a == undefined) && (b == undefined)) {
    return 0;
  }
  if (a == undefined) {
    return 1 * (isAsc ? 1 : -1);
  }
  if (b == undefined) {
    return -1 * (isAsc ? 1 : -1);
  }
}

function compareNumber(a: number, b: number, isAsc: boolean) {
  if ((a != undefined) && (b != undefined)) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  if ((a == undefined) && (b == undefined)) {
    return 0;
  }
  if (a == undefined) {
    return 1 * (isAsc ? 1 : -1);
  }
  if (b == undefined) {
    return -1 * (isAsc ? 1 : -1);
  }
}

function compareBoolean(a: boolean, b: boolean, isAsc: boolean) {
  if ((a != undefined) && (b != undefined)) {
    let va: string = (a ? 'Active' : 'Inactive');
    let vb: string = (b ? 'Active' : 'Inactive');
    return (va < vb ? -1 : 1) * (isAsc ? 1 : -1);
  }
  if ((a == undefined) && (b == undefined)) {
    return 0;
  }
  if (a == undefined) {
    return 1 * (isAsc ? 1 : -1);
  }
  if (b == undefined) {
    return -1 * (isAsc ? 1 : -1);
  }
}

function compareDate(a: Timestamp, b: Timestamp, isAsc: boolean) {
  if ((a != undefined) && (b != undefined)) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  if ((a == undefined) && (b == undefined)) {
    return 0;
  }
  if (a == undefined) {
    return 1 * (isAsc ? 1 : -1);
  }
  if (b == undefined) {
    return -1 * (isAsc ? 1 : -1);
  }
}
