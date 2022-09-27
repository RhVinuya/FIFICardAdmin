import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Card } from 'src/app/models/card';
import { CardsService } from 'src/app/services/cards.service';

@Component({
  selector: 'app-card-thumb',
  templateUrl: './card-thumb.component.html',
  styleUrls: ['./card-thumb.component.css']
})
export class CardThumbComponent implements OnInit {
  @Input() set setCard(value: Card) {
    this.card = value;
  }
  @Output() statusevent: EventEmitter<Card> = new EventEmitter<Card>();

  service: CardsService;

  constructor(
    private _service: CardsService
  ) {
    this.service = _service;
  }

  card: Card;
  isTriggered: boolean = false;
  status: boolean = false;

  ngOnInit() {
    this.status = this.card!.active!;
    this.selfFixing();
  }

  selfFixing() {
    if (!this.card.events || this.card.events.length == 0) {
      if (this.card.event || this.card.event != '') {
        console.log(this.card.id, this.card.event);
      }
    }

    if (!this.card.recipients || this.card.recipients.length == 0) {
      if (this.card.recipient || this.card.recipient != '') {
        console.log(this.card.id, this.card.recipient);
      }
    }
  }

  generateNewCode() {
    this.isTriggered = true;
    this.service.getNextCode().then(code => {
      this.service.updateNewCode(this.card.id!, code.toString()).then(() => {
        this.card.code = code.toString();
      });
    });

  }

  deleteCard() {
    this.isTriggered = true;
    this.service.deleteCard(this.card.id!).then(() => {
      this.card.code = '';
      this.card.name = '';
    })
  }

  updateStatus(event: any) {
    this.card.active = event.checked;
    this.statusevent.emit(this.card);
  }
}
