import { element } from 'protractor';
import { Rating } from './../../models/rating';
import { CardsService } from 'src/app/services/cards.service';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar, MatTableDataSource } from '@angular/material';
import { RatingDialogComponent } from '../rating-dialog/rating-dialog.component';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})

export class RatingsComponent implements OnInit {
  @Input() id: string;
  dialogRef: MatDialogRef<RatingDialogComponent>;
  service: CardsService;
  initalizing: boolean;
  norecords: boolean;
  dataSource: MatTableDataSource<Rating> = new MatTableDataSource();
  displayedColumns: string[] = ['username', 'date', 'rate', 'title', 'approve', 'action'];
  snackBar: MatSnackBar;

  avarageRating: number;

  constructor(
    private dialog: MatDialog,
    private _service: CardsService,
    private _snackBar: MatSnackBar
  ) { 
    this.service = _service;
    this.snackBar = _snackBar;
  }

  ngOnInit() {
    this.loadUser();
  }

  loadUser(){
    this.service.getCard(this.id).then(card => {
      this.avarageRating = card.ratings;
      this.loadRatings();
    })
  }

  loadRatings(){
    this.initalizing = true;
    this.norecords = false;
    this.service.getRatings(this.id).then(ratings => {
      this.dataSource.data = ratings;
      this.initalizing = false;
      this.norecords = false;

      if (ratings.length > 0){
        this.calculateAverageRatings(ratings);
      }
    }).catch(reason => {
      this.norecords = true;
      this.initalizing = false;
    })
  }

  calculateAverageRatings(ratings: Rating[]){
    let totalRatings: number = 0;
    let approveRatingCount: number = 0;
    ratings.forEach(rating => {
      if (rating.approve){
        totalRatings = totalRatings + rating.rate;
        approveRatingCount++;
      }
    });
    let average = totalRatings/approveRatingCount;
    if (this.avarageRating != average){
      this.avarageRating = average;
      this.service.updateAverageRatings(this.id, this.avarageRating);
    }
  }

  addRating(){
    const dialogConfig = new MatDialogConfig();
    this.dialogRef = this.dialog.open(RatingDialogComponent, dialogConfig);

    this.dialogRef.afterClosed().subscribe(data => {
      if(data){
        this.service.addRating(this.id, data);
        this.snackBar.open("Rating Added", "", {
          duration: 3000
        });
        this.loadRatings();
      }
    });

  }

  editRating(element: Rating){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      rating: element
    };
    this.dialogRef = this.dialog.open(RatingDialogComponent, dialogConfig);

    this.dialogRef.afterClosed().subscribe(data => {
      if (data){
        this.service.UpdateRating(this.id, data);
        this.snackBar.open("Rating Updated", "", {
          duration: 3000
        });
        this.loadRatings();
      }
    });
  }
}
