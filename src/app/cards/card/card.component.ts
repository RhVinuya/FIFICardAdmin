import { Type } from './../../models/type';
import { TypeService } from 'src/app/services/type.service';
import { ConfirmDialogComponent } from './../../shared/confirm-dialog/confirm-dialog.component';
import { Recipient } from 'src/app/models/recipient';
import { RecipientService } from 'src/app/services/recipient.service';
import { Occasion } from 'src/app/models/occasion';
import { EventService } from 'src/app/services/event.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from 'src/app/models/card';
import { CardsService } from 'src/app/services/cards.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TranslationService } from 'src/app/services/translation.service';
import { Translation } from 'src/app/models/translation';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  id?: string;
  dialogRef: MatDialogRef<ConfirmDialogComponent>;

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

  typeService: TypeService;
  typeConfig: Type[] = [];
  types: string[] = [];

  translationService: TranslationService;
  translation: Translation = new Translation();

  defaultCode: string = 'To be generated upon saving';

  constructor(
    private _service: CardsService,
    private _eventService: EventService,
    private _recipientService: RecipientService,
    private _typeService: TypeService,
    private _translationService: TranslationService,
    private _activateRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private titleService: Title,
    private dialog: MatDialog,
  ) {
    this.service = _service;
    this.eventService = _eventService;
    this.recipientService = _recipientService;
    this.typeService = _typeService;
    this.translationService = _translationService;
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
          else {
            if (data.event)
              this.events = data.event.split(',');
            else
              this.events = [];
          }

          if (data.recipients)
            this.recipients = data.recipients;
          else {
            if (data.recipient)
              this.recipients = data.recipient.split(',');
            else
              this.recipients = [];
          }

          this.types = data.types != undefined ? data.types : [];

          this.titleService.setTitle('Fibei Greetings - ' + data.name);

          this.cardForm.reset(
            {
              id: data.id,
              code: data.code ? data.code : this.defaultCode,
              name: data.name,
              description: data.description,
              details: data.details,
              price: Number(data.price).toFixed(2),
              active: data.active,
              bestseller: data.bestseller,
              featured: data.featured,
            }
          );
          
          this.translation.description = data.description!;
          this.getTranslation(data.id);
        });
      }
    });

    this.getEvents();
    this.getRecipients();
    this.getTypes();
  }

  getTranslation(id: string){
    this.translationService.getTranslation(id).then(translation => {
      this.translation = translation;
    }).catch(err => {
      this.translationService.createTranslation(id, this.translation);
    });
  }

  onKeyPressEvent(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode == 46) {
      return true;
    }
    else if (charCode < 48 || charCode > 57) {
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
        console.log(this.cardForm.value);
        let card: Card = this.cardForm.value as Card;
        card.event = this.events.join(',');
        card.events = this.events;
        card.recipient = this.recipients.join(',');
        card.recipients = this.recipients;
        card.types = this.types;

        this.verifyCardName(card).then(status => {
          if (!status) {
            this.saveProcess(card);
          }
        });
        this.isSaving = false;
      }
    }
  }

  verifyCardName(card: Card): Promise<boolean> {
    return new Promise((resolve) => {
      this.service.getCardByName(card.name).then(id => {
        console.log(id, this.id!);
        if (id != card.id!) {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = {
            message: "Card name already been used, Are you sure you want to duplicate the name?"
          }
          this.dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

          this.dialogRef.afterClosed().subscribe(data => {
            if (data) {
              this.saveProcess(card);
            }
          });

          resolve(true);
        }
        else {
          resolve(false);
        }

      }).catch(err => {
        resolve(false);
      });
    });
  }

  saveProcess(card: Card) {
    this.isSaving = true;
    if (card.id) {
      this.service.updateCard(card).then(() => {
        if (this.translation.description != card.description){
          this.translation.description = card.description;
          this.translationService.updateTranslation(card.id!, this.translation);
        }
        
        this.isSaving = false;
        this.snackBar.open("Card Updated", "", { duration: 3000 });
      });
    }
    else {
      this.service.addCard(card).then(id => {
        this.translation.description = card.description;
        this.translationService.createTranslation(card.id, this.translation);

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
    if (value) {
      this.recipients.push(value);
    }
  }

  selectedRecipient(recipient: MatAutocompleteSelectedEvent): void {
    this.recipients.push(recipient.option.viewValue);
  }

  getTypes() {
    this.typeService.getTypes().then(data => {
      this.typeConfig = data;
    })
  }

  removeType(type: string): void {
    const index = this.types.indexOf(type);

    if (index >= 0) {
      this.types.splice(index, 1);
    }
  }

  addType(type: MatChipInputEvent): void {
    const value = (type.value || '').trim();
    if (value) {
      this.types.push(value);
    }
  }

  selectedType(type: MatAutocompleteSelectedEvent): void {
    this.types.push(type.option.viewValue);
  }
}
