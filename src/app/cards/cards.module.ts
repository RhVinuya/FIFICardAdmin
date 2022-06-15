import { CardsRoutingModule } from './cards-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CardListComponent } from './card-list/card-list.component';
import { CardComponent } from './card/card.component';
import { UploadComponent } from './upload/upload.component';
import { RatingsComponent } from './ratings/ratings.component';
import { RatingDialogComponent } from './rating-dialog/rating-dialog.component';
import { SignAndSendDialogComponent } from './sign-and-send-dialog/sign-and-send-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { CardThumbComponent } from './card-thumb/card-thumb.component';

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
    RatingDialogComponent,
    SignAndSendDialogComponent,
    ConfirmDialogComponent,
    CardThumbComponent
  ],
  entryComponents: [
    RatingDialogComponent,
    SignAndSendDialogComponent,
    ConfirmDialogComponent
  ]
})
export class CardsModule { }