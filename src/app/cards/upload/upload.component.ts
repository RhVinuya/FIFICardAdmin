import { UploadService } from './../../services/upload.service';
import { Component, Input, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { CardsService } from 'src/app/services/cards.service';
import { MatSnackBar } from '@angular/material';
import { delay } from 'rxjs-compat/operator/delay';

export class Image{
  public visible: boolean;
  public url: string;
  public name: string;
  constructor(_url: string, _name: string){
    this.url = _url;
    this.name = _name;
    this.visible = true;
  }
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  @Input() id: string;

  initalizing: boolean;
  withRecords: boolean;
  urls: Image[] = [];
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
    this.initalizing = true;
    this.withRecords = true;
  }

  ngOnInit() {
    this.service.getImages(this.id).then(data => {
      if (data != undefined){
        data.forEach(image => {
          this.uploadService.getDownloadURL(image).then(url => {
            this.urls.push(new Image(url, image));
          });
        });
      }
      else{
        this.withRecords = false;
      }
      this.initalizing = false;
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

      task.snapshotChanges().subscribe(snap => {
        if (snap.bytesTransferred == snap.totalBytes){
          let path: string = snap.ref['location']['path_'];
          let interval = Math.floor(snap.totalBytes/10000);

          setTimeout(()=>{ 
            this.isUploading = false;
            ref.getDownloadURL().subscribe(url => {
              this.urls.push(new Image(url, path));
              this.updateCardImages();
              this.snackBar.open("Image Uploaded: " + file.name, "", {
                duration: interval * 10
              });
            });
          }, 5000);
        }
      });

      task.percentageChanges().subscribe(per => {
        this.progress = per;
        if (per == 100){
        }
      });
    }
  }

  delete(image: Image){
    image.visible = false;
    this.updateCardImages();
  }

  updateCardImages(){
    let images: string[] = [];
    this.urls.forEach(image => {
      if (image.visible)
        images.push(image.name);
    })
    this.service.updateImages(this.id, images);
  }

}
