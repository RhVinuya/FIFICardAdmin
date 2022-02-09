import { CardsRoutingModule } from './cards-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CardListComponent } from './card-list/card-list.component';
import { CardComponent } from './card/card.component';
import { UploadComponent } from './upload/upload.component';

@NgModule({
    imports: [
      CommonModule,
      CardsRoutingModule,
      SharedModule
    ],
    declarations: [
    CardListComponent,
    CardComponent,
    UploadComponent],
    entryComponents: [
    ]
  })
  export class CardsModule { }