import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/models/card';

@Component({
  selector: 'app-card-thumb',
  templateUrl: './card-thumb.component.html',
  styleUrls: ['./card-thumb.component.css']
})
export class CardThumbComponent implements OnInit {
  @Input() card: Card;

  constructor() { }

  ngOnInit() {
    this.selfFixing();
  }

  selfFixing(){
    if (!this.card.events || this.card.events.length == 0){
      if (this.card.event || this.card.event != ''){
        console.log(this.card.id, this.card.event);
      }
    }

    if (!this.card.recipients || this.card.recipients.length == 0){
      if (this.card.recipient || this.card.recipient != ''){
        console.log(this.card.id, this.card.recipient);
      }
    }
  }

}
