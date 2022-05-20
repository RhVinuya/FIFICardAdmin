import { Recipient } from 'src/app/models/recipient';
import { RecipientService } from 'src/app/services/recipient.service';
import { Occasion } from 'src/app/models/occasion';
import { EventService } from 'src/app/services/event.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
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

  defaultCode: string = 'To be generated upon saving';

  constructor(
    private _service: CardsService,
    private _eventService: EventService,
    private _recipientService: RecipientService,
    private _activateRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _router: Router,
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
    this.titleService.setTitle('Fibei Greetings - Card');

    this.cardForm = this.fb.group({
      id: [''],
      code: [this.defaultCode],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      details: ['', [Validators.required]],
      price: [Number(0), [Validators.required, Validators.min(0)]],
      active: [Boolean(false)],
      bestseller: [Boolean(false)],
      featured: [Boolean(false)],
    });

    this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
      if (this.id != 'new') {
        this.service.getCard(this.id).then(data => {
          if (data.events)
            this.events = data.events;
          else{
            if (data.event)
              this.events = data.event.split(',');
            else
              this.events = [];
          }

          if (data.recipients)
            this.recipients = data.recipients;
          else{
            if (data.recipient)
              this.recipients = data.recipient.split(',');
            else
              this.recipients = [];
          }

          this.cardForm.reset(
            {
              id: data.id,
              code: data.code? data.code:this.defaultCode,
              name: data.name,
              description: data.description,
              details: data.details,
              price: Number(data.price).toFixed(2),
              active: data.active,
              bestseller: data.bestseller,
              featured: data.featured,
            }
          );
        }).catch(reason => {
        })

      }
    });

    this.getEvents();
    this.getRecipients();
  }

  onKeyPressEvent(event: any){
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode == 46){
      return true;
    }
    else if (charCode < 48 || charCode > 57){
      event.preventDefault();
      return false;
    } else {
      return true;
    }
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
        this.saveProcess(card);
      }
    }
  }

  saveProcess(card: Card){
    if (card.id) {
      this.service.updateCard(card).then(() => {
        this.isSaving = false;
        this.snackBar.open("Card Updated", "", { duration: 3000 });
      });
    }
    else {
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
