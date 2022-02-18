import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Title } from '@angular/platform-browser';
import { CardsService } from 'src/app/services/cards.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort} from '@angular/material/sort';
import { Card } from 'src/app/models/card';
import { tap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { C } from '@angular/cdk/keycodes';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent implements OnInit {
  service: CardsService;

  fb: FormBuilder;
  searchForm: FormGroup;

  cards: Card[];
  length: number;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 20, 50, 100];

  dataSource: MatTableDataSource<Card> = new MatTableDataSource();
  displayedColumns: string[] = ['name', 'description', 'price', 'event', 'recipient', 'active', 'action'];
  initalizing: boolean;
  withRecords: boolean;

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
      this.loadData(data);
    }).catch(reason =>{
      this.withRecords = false;
      this.initalizing = false;
    });

    this.searchForm = this.fb.group({
      search: ['']
    })
  }

  loadData(data: Card[]){
    if (data.length > 0)
    {
      this.cards = data;
      this.length = this.cards.length;
      this.pageIndex = 0;
      this.updateRange();
      //this.dataSource.data = this.cards;
      this.withRecords = true;
    }
    else{
      this.length = 0;
      this.pageIndex = 0;
      this.withRecords = false;
    }
    this.initalizing = false;
  }

  sortData(sort: Sort){
    const data = this.dataSource.data.slice();
    if (sort.direction != ''){
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
          default:
            return 0;
        }
      });
    }
  }

  searchCard(){
    let search: string = this.searchForm.value['search'];

    this.initalizing = true;
    this.withRecords = true;

    this.service.getCards().then(data => {
      if (search == ''){
        this.loadData(data);
      }
      else{
        let newCards: Card[] = [];
        
        data.forEach(card => {
          if (card.name.includes(search)){
            newCards.push(card);
          }
          else if (card.description.includes(search)){
            newCards.push(card);
          }
          else if ((card.event) && (card.event.includes(search))){
            newCards.push(card);
          } 
          else if ((card.recipient) && (card.recipient.includes(search))){
            newCards.push(card);
          }
        });
        this.loadData(newCards);
      }
    }).catch(reason =>{
      this.withRecords = false;
      this.initalizing = false;
    });
  }

  onPageChange(event: PageEvent){
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateRange();
  }

  updateRange(){
    let start: number = this.pageIndex * this.pageSize;
    let end: number = start + this.pageSize;
    let selectedCards: Card[] = [];
    for(let i = start; i < end; i++){
      if (this.cards[i]){
        selectedCards.push(this.cards[i]);
      }
    }
    this.dataSource.data = selectedCards;
  }
}

function compare(a: string, b: string, isAsc: boolean) {
  if ((a != undefined) && (b != undefined)){
   return (a.trim() < b .trim()? -1 : 1) * (isAsc ? 1 : -1);
  }
  if ((a == undefined) && (b == undefined)){
    return 0;
  }
  if (a == undefined){
    return 1 * (isAsc ? 1 : -1);
  }
  if (b == undefined){
    return -1 * (isAsc ? 1 : -1);
  }
}

function compareNumber(a: number, b: number , isAsc: boolean){
  if ((a != undefined) && (b != undefined)){
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  if ((a == undefined) && (b == undefined)){
    return 0;
  }
  if (a == undefined){
    return 1 * (isAsc ? 1 : -1);
  }
  if (b == undefined){
    return -1 * (isAsc ? 1 : -1);
  }
}

function compareBoolean(a: boolean, b: boolean, isAsc: boolean){
  if ((a != undefined) && (b != undefined)){
    let va: string = (a? 'Active' : 'Inactive');
    let vb: string = (b? 'Active' : 'Inactive');
    return (va < vb ? -1 : 1) * (isAsc ? 1 : -1);
  }
  if ((a == undefined) && (b == undefined)){
    return 0;
  }
  if (a == undefined){
    return 1 * (isAsc ? 1 : -1);
  }
  if (b == undefined){
    return -1 * (isAsc ? 1 : -1);
  }
}
