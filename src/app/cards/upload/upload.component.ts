import { UploadService } from './../../services/upload.service';
import { Component, Input, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { CardsService } from 'src/app/services/cards.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  @Input() id: string;

  images: string[] = [];
  urls: string[] = [];
  progress: number = 0;
  isUploading: boolean = false;

  service: CardsService;
  uploadService: UploadService;
  snackBar: MatSnackBar;

  constructor(private _service: CardsService,
    private _uploadService: UploadService,
    private _snackBar: MatSnackBar,
    private logger: NGXLogger) { 
    this.service = _service;
    this.uploadService = _uploadService;
    this.snackBar = _snackBar;
  }

  ngOnInit() {
    this.service.getImages(this.id).then(data => {
      if (data != undefined){
        this.images = data;
        this.images.forEach(image => {
          this.uploadService.getDownloadURL(image).then(url => {
            this.urls.push(url);
            console.log(this.urls);
          });
        });
      }
    });
  }

  uploadFile(event: any){
    if (!this.isUploading){
      this.isUploading = true;
      this.progress = 5;
      const file: File = event.target.files[0];
      this.logger.log('Upload: ' + file.name);
      const ref = this.uploadService.uploadRef(this.id);
      const task = this.uploadService.uploadFile(file, ref);

      task.percentageChanges().subscribe(per => {
        this.progress = per;
        if (per == 100){
          this.isUploading = false;
          ref.getMetadata().subscribe(meta => {
            this.images.push(meta['fullPath']);
            this.service.updateImages(this.id, this.images);
          });
          ref.getDownloadURL().subscribe(url => {
            this.urls.push(url);
          });
          this.snackBar.open("Image Uploaded: " + file.name, "", {
            duration: 3000
          });
        }
      }, error => {
        this.isUploading = false;
      });
    }
  }

}
