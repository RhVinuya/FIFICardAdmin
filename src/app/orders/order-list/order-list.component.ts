import { UsersService } from './../../services/users.service';
import { OrdersService } from './../../services/orders.service';
import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  service: OrdersService;

  fb: FormBuilder;
  searchForm: FormGroup;

  orders: Order[];
  displayOrder: Order[] = [];
  length: number;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 20, 50, 100];

  initializing: boolean = false;
  withRecords: boolean = false;
  status: string[] = [];
  cards: string[] = [];
  filterStatus: string = '';
  dataSource: MatTableDataSource<Order  > = new MatTableDataSource();
  displayedColumns: string[] = ['card', 'sender', 'recipient', 'anonymously', 'sendto', 'address', 'payment', 'status', 'date', 'action'];

  constructor(
    private _service: OrdersService,
    private _fb: FormBuilder,
    private userService: UsersService
  ) { 
    this.service = _service;
    this.fb = _fb;
  }

  ngOnInit() {
    this.loadOrders();

    this.searchForm = this.fb.group({
      status: ['All'],
      card: ['All'],
      search: ['']
    })
  }

  loadOrders(){
    this.initializing = true;
    this.withRecords = true ;

    this.service.getOrders().then(orders => {
      this.orders = orders;
      this.searchRecords('', 'All', 'All');
      this.generateFilter();
      
      this.initializing = false;
      this.withRecords = true;

    }).then(reason => {
      this.initializing = false;
      this.withRecords = true;
    })
  }

  generateFilter(){
    this.status.slice();
    if (this.orders){
      if(this.orders.length > 0){
        this.orders.forEach(order => {
          this.addStatus(order.status.trim());
          this.addCard(order.card_name.trim());
        })
      }
    }
  }

  addStatus(_status: string){
    let isFound: Boolean = false;
    this.status.forEach(status => {
      if(_status == status){
        isFound = true;
      }
    });
    if (!isFound)
      this.status.push(_status);
  }

  addCard(_card: string)
  {
    let isFound: Boolean = false;
    this.cards.forEach(card => {
      if(_card == card){
        isFound = true;
      }
    });
    if (!isFound)
      this.cards.push(_card);
  }
  
  updateRange(){
    let start: number = this.pageIndex * this.pageSize;
    let end: number = start + this.pageSize;
    let selectedOrders: Order[] = [];
    for(let i = start; i < end; i++){
      if (this.displayOrder[i]){
        selectedOrders.push(this.displayOrder[i]);
      }
    }
    this.dataSource.data = selectedOrders;
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateRange();
  }

  searchCard(){
    let search: string = this.searchForm.value['search'];
    let card: string = this.searchForm.value['card'];
    let status: string = this.searchForm.value['status'];
    this.searchRecords(search, card, status);
  }

  searchRecords(search: string, card: string, status: string){
    this.initializing = true;
    this.withRecords = true ;
    this.displayOrder = [];

    if ((search.length == 0) && (status == 'All') && (card == 'All')){
      this.displayOrder = this.orders;
      this.length = this.displayOrder.length;
      this.updateRange();
    }
    else{
      this.orders.forEach(order => {
        let searchMatch: boolean = true;
        let cardMatch: boolean = true;
        let statusMatch: boolean = true;

        if (search.length > 0){
          if (order.sender_name.includes(search)) {
            searchMatch = true;
          }
          else if (order.receiver_name.includes(search)) {
            searchMatch = true;
          }
          else{
            searchMatch = false;
          }
        }

        if (card != 'All'){
          if (order.card_name.trim() != card.trim()){
            cardMatch = false;
          }
        }

        if (status != 'All'){
          if (order.status.trim() != status.trim()){
            statusMatch = false;
          }
        }
        
        if (searchMatch && statusMatch && cardMatch){
          this.displayOrder.push(order);
        }
      });

      this.length = this.displayOrder.length;
      this.updateRange();
    }

    this.initializing = false;
    this.withRecords = this.length > 0;
  }

  validateEmail(email) 
    {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

  fixOrders(){
    this.service.getOrders().then(orders => {
      orders.forEach(order => {
        if (this.validateEmail(order.sender_email)){
          this.userService.getUserByEmail(order.sender_email).then(user => {
            //this.service.updateUserId(order.id, user.id)
            console.log("Found => " + order.sender_email, user.uid);  
          }).catch(reason => {
          })
        }
      })
    })
  }
}
