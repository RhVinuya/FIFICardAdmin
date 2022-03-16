import { CardsRoutingModule } from './cards-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CardListComponent } from './card-list/card-list.component';
import { CardComponent } from './card/card.component';
import { UploadComponent } from './upload/upload.component';
import { RatingsComponent } from './ratings/ratings.component';
import { RatingDialogComponent } from './rating-dialog/rating-dialog.component';

@NgModule({
    imports: [
      CommonModule,
      CardsRoutingModule,
      SharedModule
    ],
    declarations: [
    CardListComponent,
    CardComponent,
    UploadComponent,
    RatingsComponent,
    RatingDialogComponent],
    entryComponents: [
      RatingDialogComponent
    ]
  })
  export class CardsModule { }