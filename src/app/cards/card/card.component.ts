import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Card } from 'src/app/models/card';
import { CardsService } from 'src/app/services/cards.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  id?: string;

  service: CardsService;
  activateRoute: ActivatedRoute;
  fb: FormBuilder;
  snackBar: MatSnackBar;
  router: Router;

  cardForm: FormGroup;
  isSaving: boolean;

  constructor(private _service: CardsService,
    private _activateRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private logger: NGXLogger,
    private titleService: Title) { 
      this.service = _service;
      this.activateRoute = _activateRoute;
      this.fb = _fb;
      this.snackBar = _snackBar;
      this.router = _router;
    }

  ngOnInit() {
    this.titleService.setTitle('FIFI Card Admin - Card');

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
      if (this.id != 'new'){
        this.logger.log('Card loaded: ' + this.id);
        this.service.getCard(this.id).then(data => {
          this.cardForm.reset(
            {
              id: data.id,
              name: data.name,
              description: data.description,
              details: data.details,
              price: formatCurrency(data.price!, 'en_PH', '' ),
              active: data.active,
            }
          );
        }).catch(reason =>{
          this.logger.error(reason);
        })

      }
    });
  }

  saveCard(){
    if (!this.isSaving){
      if (this.cardForm.valid){
        this.isSaving = true;
        let card: Card = this.cardForm.value as Card;
        if (card.id){
          this.logger.log('Update Card: ' + card.id);
          this.service.updateCard(card).then(()=>{
            this.isSaving = false;
            this.snackBar.open("Card Updated", "", { duration: 3000 });
          });
        }
        else{
          this.logger.log('Create Card');
          this.service.addCard(card).then(id => {
            this.isSaving = false;
            this.router.navigate(['/cards/' + id]).then(navigated => {
              if(navigated) {
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

}
