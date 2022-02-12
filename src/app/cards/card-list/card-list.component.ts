import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Title } from '@angular/platform-browser';
import { CardsService } from 'src/app/services/cards.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort} from '@angular/material/sort';
import { Card } from 'src/app/models/card';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent implements OnInit {
  service: CardsService;

  cards: Card[];
  dataSource: MatTableDataSource<Card> = new MatTableDataSource();
  displayedColumns: string[] = ['name', 'description', 'price', 'event', 'recipient', 'active', 'action'];
  initalizing: boolean;
  withRecords: boolean;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

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
        this.dataSource.data = this.cards;
        this.withRecords = true;;   
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
