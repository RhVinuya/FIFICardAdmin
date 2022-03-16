import { Rating } from './../../models/rating';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { firestore } from "firebase";
import Timestamp = firestore.Timestamp

@Component({
  selector: 'app-rating-dialog',
  templateUrl: './rating-dialog.component.html',
  styleUrls: ['./rating-dialog.component.css']
})
export class RatingDialogComponent implements OnInit {
  form: FormGroup;
  rating: number;
  data: Rating;
  isWithData: boolean;

  constructor(
    private fb: FormBuilder,
    private ratingDialogRef: MatDialogRef<RatingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    if (data){
      this.data = data.rating;
    }
  }

  ngOnInit() {
    if (this.data){
      this.form = this.fb.group({
        username: [this.data.username, [Validators.required]],
        date: [this.data.date, [Validators.required]],
        rating: [Number(0)],
        title: [this.data.title, [Validators.required, Validators.maxLength(250)]],
        review: [this.data.review, [Validators.required, Validators.maxLength(500)]],
        approve: [Boolean(this.data.approve)]
      });
      this.updateRating(this.data.rate);
    }
    else{
      this.form = this.fb.group({
        username: ['', [Validators.required]],
        date: [Date, [Validators.required]],
        rating: [Number(0)],
        title: ['', [Validators.required, Validators.maxLength(250)]],
        review: ['', [Validators.required, Validators.maxLength(500)]],
        approve: [Boolean(true)]
      });
    }
  }

  save() {
    if (this.form.valid){
      let rating: Rating = this.form.value as Rating;
      if (this.data)
        rating.id = this.data.id;
      rating.rate = this.rating;
      this.ratingDialogRef.close(rating);
    }
  }

  close() {
    this.ratingDialogRef.close();
  }

  updateRating(rate: number){
    this.rating = rate;
  }
}
