import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CardsService } from 'src/app/services/cards.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Card } from 'src/app/models/card';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { firestore } from "firebase";
import Timestamp = firestore.Timestamp;
import { isatty } from 'tty';

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
  displayedColumns: string[] = ['code', 'name', 'description', 'price', 'event', 'recipient', 'ratings', 'active', 'date', 'action'];
  initalizing: boolean;
  withRecords: boolean;

  listOfEvents: string[] = [];
  listOfRecipients: string[] = [];

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private _service: CardsService,
    private _fb: FormBuilder,
    private titleService: Title) {
    this.service = _service;
    this.fb = _fb;
    this.initalizing = true;
    this.withRecords = true;
  }

  ngOnInit() {
    this.titleService.setTitle('Fibei Greetings - Cards');
    
    this.service.getNextCode().then(next => {
      console.log(next);
    })

    this.service.getCards().then(data => {
      this.loadData(data);
      this.generateLists(data);
    }).catch(reason => {
      this.withRecords = false;
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
    this.initalizing = true;
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
    console.log(sort.active);
    if (sort.direction != '') {
      const isAsc: boolean = sort.direction === "asc";
      let sortedCards: Card[];

      if (sort.active == "code") {
        if (!isAsc)
          sortedCards = this.cards.sort((a, b) => 0 - (Number(a.code!) > Number(b.code!) ? -1 : 1));
        else
          sortedCards = this.cards.sort((a, b) => 0 - (Number(a.code!) > Number(b.code!) ? 1 : -1));
      }
      else if (sort.active == "name") {
        if (!isAsc)
          sortedCards = this.cards.sort((a, b) => 0 - (a.name!.trim().toUpperCase() > b.name!.trim().toUpperCase() ? -1 : 1));
        else
          sortedCards = this.cards.sort((a, b) => 0 - (a.name!.trim().toUpperCase() > b.name!.trim().toUpperCase() ? 1 : -1));
      }
      else if (sort.active == "description") {
        if (!isAsc)
          sortedCards = this.cards.sort((a, b) => 0 - (a.description!.trim().toUpperCase() > b.description!.trim().toUpperCase() ? -1 : 1));
        else
          sortedCards = this.cards.sort((a, b) => 0 - (a.description!.trim().toUpperCase() > b.description!.trim().toUpperCase() ? 1 : -1));
      }
      else if (sort.active == "price") {
        if (!isAsc)
          sortedCards = this.cards.sort((a, b) => 0 - (Number(a.price!||0) > Number(b.price!||0) ? -1 : 1));
        else
          sortedCards = this.cards.sort((a, b) => 0 - (Number(a.price!||0) > Number(b.price!||0) ? 1 : -1));
      }
      else if (sort.active == "event") {
        if (!isAsc)
          sortedCards = this.cards.sort((a, b) => 0 - (a.event!.trim().toUpperCase() > b.event!.trim().toUpperCase() ? -1 : 1));
        else
          sortedCards = this.cards.sort((a, b) => 0 - (a.event!.trim().toUpperCase() > b.event!.trim().toUpperCase() ? 1 : -1));
      }
      else if (sort.active == "recipient") {
        if (!isAsc)
          sortedCards = this.cards.sort((a, b) => 0 - (a.recipient!.trim().toUpperCase() > b.recipient!.trim().toUpperCase() ? -1 : 1));
        else
          sortedCards = this.cards.sort((a, b) => 0 - (a.recipient!.trim().toUpperCase() > b.recipient!.trim().toUpperCase() ? 1 : -1));
      }
      else if (sort.active == "ratings") {
        if (!isAsc)
          sortedCards = this.cards.sort((a, b) => 0 - (Number(a.ratings!||0) > Number(b.ratings!||0) ? -1 : 1));
        else
          sortedCards = this.cards.sort((a, b) => 0 - (Number(a.ratings!||0) > Number(b.ratings!||0) ? 1 : -1));
      }
      else if (sort.active == "active") {
        if (!isAsc)
          sortedCards = this.cards.sort((a, b) => 0 - (a.active! > b.active! ? -1 : 1));
        else
          sortedCards = this.cards.sort((a, b) => 0 - (a.active! > b.active! ? 1 : -1));
      }
      else if (sort.active == "date") {
        if (!isAsc)
          sortedCards = this.cards.sort((a, b) => 0 - (a.modified! > b.modified! ? -1 : 1));
        else
          sortedCards = this.cards.sort((a, b) => 0 - (a.modified! > b.modified! ? 1 : -1));
        console.log(7, sortedCards[0].name);
      }
      else {
        sortedCards = this.cards.sort((a, b) => 0 - (a.created! > b.created! ? 1 : -1));
      }
      
      this.updateRange()
    }
  }

  searchCard() {
    let search: string = this.searchForm.value['search'];
    let event: string = this.searchForm.value['event'];
    let recipient: string = this.searchForm.value['recipient'];
    let status: string = this.searchForm.value['status'];

    this.initalizing = true;
    this.withRecords = true;

    if ((!search) && (event == 'All') && (recipient == 'All') && (status == 'All')) {
      this.loadData(this.completeCards);
      this.initalizing = false;
      this.withRecords = this.cards.length > 0;
    }
    else {
      this.service.getCards().then(data => {
        let newCards: Card[] = [];
        data.forEach(card => {
          let isSearchMatch: boolean = false;
          let isEventMatch: boolean = false;
          let isRecipientMatch: boolean = false;
          let isStatus: boolean = false;

          if (search) {
            if (card.name)
              if (card.name.includes(search)) {
                isSearchMatch = true;
              }
            if (card.description)
              if (card.description.includes(search)) {
                isSearchMatch = true;
              }
            if (card.code)
              if (card.code.includes(search)) {
                isSearchMatch = true;
              }
          }
          else {
            isSearchMatch = true;
          }

          if (event != 'All') {
            let listOfEvents = card.event.split(',');
            listOfEvents.forEach(_event => {
              if (_event.trim() == event.trim()) {
                isEventMatch = true;
              }
            });
          }
          else {
            isEventMatch = true;
          }

          if (recipient != 'All') {
            let listOfRecipients = card.recipient.split(',');
            listOfRecipients.forEach(_recipient => {
              if (_recipient.trim() == recipient.trim()) {
                isRecipientMatch = true;
              }
            })
          }
          else {
            isRecipientMatch = true;
          }

          if (status != 'All') {
            if (card.active && (status == 'active')) {
              isStatus = true
            }
            if (!card.active && (status == 'inactive')) {
              isStatus = true
            }
          }
          else {
            isStatus = true;
          }

          if (isSearchMatch && isEventMatch && isRecipientMatch && isStatus) {
            console.log(card);
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
    this.dataSource.data = this.cards.slice(start, end);
    this.dataSource.sort = this.sort;
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
