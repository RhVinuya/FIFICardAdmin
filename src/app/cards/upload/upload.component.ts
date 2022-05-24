import { SignAndSendDialogComponent } from './../sign-and-send-dialog/sign-and-send-dialog.component';
import { environment } from './../../../environments/environment';
import { UploadService } from './../../services/upload.service';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CardsService } from 'src/app/services/cards.service';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from '@angular/material';
import { CdkDragDrop, CdkDragEnter, CdkDragMove, moveItemInArray, } from '@angular/cdk/drag-drop';

export class Image {
  public visible: boolean;
  public url: string;
  public name: string;
  public primary: boolean;

  constructor(_url: string, _name: string) {
    this.url = _url;
    this.name = _name;
    this.visible = true;
    this.primary = false;
  }
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  @ViewChild('dropListContainer', { static: false }) dropListContainer?: ElementRef;
  @Input() id: string;

  dialogRef: MatDialogRef<SignAndSendDialogComponent>;

  dropListReceiverElement?: HTMLElement;
  dragDropInfo?: {
    dragIndex: number;
    dropIndex: number;
  };

  initalizing: boolean;
  withRecords: boolean;
  urls: Image[] = [];
  progress: number = 0;
  isUploading: boolean = false;
  primary: string = '';

  service: CardsService;
  uploadService: UploadService;
  snackBar: MatSnackBar;

  constructor(
    private _service: CardsService,
    private _uploadService: UploadService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.service = _service;
    this.uploadService = _uploadService;
    this.snackBar = _snackBar;
    this.initalizing = true;
    this.withRecords = true;
  }

  drop(event: CdkDragDrop<Image[]>) {
    moveItemInArray(this.urls, event.previousIndex, event.currentIndex);
    this.updateCardImages();
  }

  dragEntered(event: CdkDragEnter<number>) {
    const drag = event.item;
    const dropList = event.container;
    const dragIndex = drag.data;
    const dropIndex = dropList.data;

    this.dragDropInfo = { dragIndex, dropIndex };

    const phContainer = dropList.element.nativeElement;
    const phElement = phContainer.querySelector('.cdk-drag-placeholder');

    if (phElement) {
      phContainer.removeChild(phElement);
      phContainer.parentElement!.insertBefore(phElement, phContainer);

      moveItemInArray(this.urls, dragIndex, dropIndex);
      this.updateCardImages();
    }
  }

  dragMoved(event: CdkDragMove<number>) {
    if (!this.dropListContainer || !this.dragDropInfo) return;
    const placeholderElement = this.dropListContainer.nativeElement.querySelector('.cdk-drag-placeholder');
    const receiverElement = this.dragDropInfo.dragIndex > this.dragDropInfo.dropIndex ? placeholderElement.nextElementSiblings : placeholderElement.previousElementSibling;
    if (!receiverElement) {
      return;
    }

    receiverElement.style.display = 'none';
    this.dropListReceiverElement = receiverElement;
  }

  dragDropped(event: CdkDragDrop<number>) {
    if (!this.dropListReceiverElement) {
      return;
    }

    this.dropListReceiverElement.style.removeProperty('display');
    this.dropListReceiverElement = undefined;
    this.dragDropInfo = undefined;
  }

  ngOnInit() {
    this.service.getImages(this.id).then(data => {
      if (data != undefined) {
        if (data.length > 0) {
          data.forEach(image => {
            this.urls.push(new Image('', image));
            this.getAvailableImage(image).then(url => this.updateURL(image, url));
          });

          this._service.getPrimary(this.id).then(primary => {
            this.setPrimary(primary);
          })
        }
        else {
          this.verifyImages();
        }
      }
      else {
        this.verifyImages();
      }
      this.initalizing = false;
    });
  }

  getAvailableImage(image): Promise<string> {
    return new Promise((resolve) => {
      this.uploadService.getDownloadURL(image + environment.imageSize.large).then(
        url => {
          resolve(url);
        },
        err => {
          this.uploadService.getDownloadURL(image).then(
            url => {
              resolve(url);
            }
          );
        }
      );
    });
  }

  updateURL(name: string, url: string) {
    this.urls.forEach(val => {
      if (name == val.name) {
        val.url = url;
      }
    });
  }

  uploadFile(event: any) {
    if (!this.isUploading) {
      this.isUploading = true;
      this.progress = 5;
      const file: File = event.target.files[0];
      const ref = this.uploadService.uploadRef(this.id);
      const task = this.uploadService.uploadFile(file, ref);

      task.snapshotChanges().subscribe(snap => {
        if (snap.bytesTransferred == snap.totalBytes) {
          let path: string = snap.ref['location']['path_'];
          let interval = Math.floor(snap.totalBytes / 10000);

          setTimeout(() => {
            this.isUploading = false;
            this.getAvailableImage(path).then(url => {
              this.urls.push(new Image(url, path));
              this.updateCardImages();
              if (this.primary == '') {
                this.setPrimary('');
              }
              this.snackBar.open("Image Uploaded: " + file.name, "", {
                duration: interval * 10
              });
            });
          }, 5000);
        }
      });

      task.percentageChanges().subscribe(per => {
        this.progress = per;
        if (per == 100) {
        }
      });
    }
  }

  delete(image: Image) {
    image.visible = false;
    let thisIsPrimary = image.primary;
    let i: number = this.urls.indexOf(image);
    this.urls.splice(i, 1)
    this.updateCardImages();
    this.uploadService.deleteFile(image.name);
    if (thisIsPrimary) {
      this.setPrimary(undefined);
    }
    this.verifyImages();
  }

  changePrimary(image: Image) {
    this.urls.forEach(url => {
      if (url.name == image.name) {
        url.primary = true;
      }
      else {
        url.primary = false;
      }
    });
    this.service.updatePrimary(this.id, image.name);
  }

  updateCardImages() {
    let images: string[] = [];
    this.urls.forEach(image => {
      if (image.visible)
        images.push(image.name);
    })
    this.service.updateImages(this.id, images);
    this.verifyImages();
  }

  setPrimary(primary: string) {
    if ((primary) && (primary != '')) {
      this.urls.forEach(url => {
        if (primary == url.name) {
          url.primary = true;
          this.primary = url.name;
        }
      })
    }
    else {
      if ((this.urls) || (this.urls.length > 0)) {
        this.urls[0].primary = true;
        this.primary = this.urls[0].name;
        this.service.updatePrimary(this.id, this.urls[0].name);
      }
      else {
        this.primary = '';
        this.service.updatePrimary(this.id, '');
      }
    }
  }

  verifyImages() {
    this.withRecords = this.urls.length > 0;
  }

  signAndSend(image: Image) {
    this.uploadService.getDownloadURL(image.name).then(url => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        url: url,
        image: image.name,
        cardId: this.id
      }
      this.dialogRef = this.dialog.open(SignAndSendDialogComponent, dialogConfig);

      this.dialogRef.afterClosed().subscribe(data => {
        this.service.getSignAndSendCount(this.id).then(count => {
          this.service.updateSignAndSendFlag(this.id, count != 0);
        });
      });
    
    });
  };
} 

