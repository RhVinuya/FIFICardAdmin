import { Recipient } from 'src/app/models/recipient';
import { RecipientService } from 'src/app/services/recipient.service';
import { Occasion } from 'src/app/models/occasion';
import { EventService } from 'src/app/services/event.service';
import { formatCurrency } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Card } from 'src/app/models/card';
import { CardsService } from 'src/app/services/cards.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  id?: string;

  service: CardsService;
  activateRoute: ActivatedRoute;
  fb: FormBuilder;
  snackBar: MatSnackBar;
  router: Router;

  cardForm: FormGroup;
  isSaving: boolean;

  eventService: EventService;
  occasions: Occasion[] = [];
  events: string[] = [];

  recipientService: RecipientService;
  fors: Recipient[] = [];
  recipients: string[] = [];

  constructor(
    private _service: CardsService,
    private _eventService: EventService,
    private _recipientService: RecipientService,
    private _activateRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private logger: NGXLogger,
    private titleService: Title
  ) {
    this.service = _service;
    this.eventService = _eventService;
    this.recipientService = _recipientService;
    this.activateRoute = _activateRoute;
    this.fb = _fb;
    this.snackBar = _snackBar;
    this.router = _router;
  }

  ngOnInit() {
    this.titleService.setTitle('Fifi Greetings - Card');

    this.cardForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      details: ['', [Validators.required]],
      price: [Number(0)],
      active: [Boolean(false)],
    })

    this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
      if (this.id != 'new') {
        this.logger.log('Card loaded: ' + this.id);
        this.service.getCard(this.id).then(data => {
          if (data.events)
            this.events = data.events;
          else
            this.events = data.event.split(',');

          if (data.recipients)
            this.recipients = data.recipients;
          else
            this.recipients = data.recipient.split(',');


          this.cardForm.reset(
            {
              id: data.id,
              name: data.name,
              description: data.description,
              details: data.details,
              price: formatCurrency(data.price!, 'en_PH', ''),
              active: data.active,
            }
          );
        }).catch(reason => {
          this.logger.error(reason);
        })

      }
    });

    this.getEvents();
    this.getRecipients();
  }

  saveCard() {
    if (!this.isSaving) {
      if (this.cardForm.valid) {
        this.isSaving = true;
        let card: Card = this.cardForm.value as Card;
        card.event = this.events.join(',');
        card.events = this.events;
        card.recipient = this.recipients.join(',');
        card.recipients = this.recipients;
        if (card.id) {
          this.logger.log('Update Card: ' + card.id);
          this.service.updateCard(card).then(() => {
            this.isSaving = false;
            this.snackBar.open("Card Updated", "", { duration: 3000 });
          });
        }
        else {
          this.logger.log('Create Card');
          this.service.addCard(card).then(id => {
            this.isSaving = false;
            this.router.navigate(['/cards/' + id]).then(navigated => {
              if (navigated) {
                this.snackBar.open("Card Added", "", {
                  duration: 3000
                });
              }
            });
          });
        }
      }
    }
  }

  getEvents() {
    this.eventService.getEvents().then(data => {
      this.occasions = data;
    })
  }

  removeEvent(event: string): void {
    const index = this.events.indexOf(event);

    if (index >= 0) {
      this.events.splice(index, 1);
    }
  }

  addEvent(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.events.push(value);
    }
  }

  selectedEvent(event: MatAutocompleteSelectedEvent): void {
    this.events.push(event.option.viewValue);
  }

  getRecipients() {
    this.recipientService.getRecipients().then(data => {
      this.fors = data;
    })
  }

  removeRecipient(recipient: string): void {
    const index = this.recipients.indexOf(recipient);

    if (index >= 0) {
      this.recipients.splice(index, 1);
    }
  }

  addRecipient(recipient: MatChipInputEvent): void {
    const value = (recipient.value || '').trim();

    // Add our fruit
    if (value) {
      this.recipients.push(value);
    }
  }

  selectedRecipient(recipient: MatAutocompleteSelectedEvent): void {
    this.recipients.push(recipient.option.viewValue);
  }
}
