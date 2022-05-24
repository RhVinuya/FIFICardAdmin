import { SignAndSend } from './../../models/sign-and-send';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { CardsService } from 'src/app/services/cards.service';

class Textarea {
  public code: number;
  public top: number;
  public left: number;
  public width: number;
  public height: number;
  public limit: number;
  public remove: boolean;

  constructor(_code: number) {
    this.code = _code;

    this.top = 1;
    this.left = 1;
    this.height = 100;
    this.width = 400;
    this.limit = 50;
    this.remove = false;
  }
}

@Component({
  selector: 'app-sign-and-send-dialog',
  templateUrl: './sign-and-send-dialog.component.html',
  styleUrls: ['./sign-and-send-dialog.component.css']
})
export class SignAndSendDialogComponent implements OnInit {
  image: string;
  cardId: string;
  url: string
  service: CardsService;
  snackBar: MatSnackBar;
  textareaCount: number = 1;
  textareas: Textarea[] = [];
  textareasForSaving: Textarea[] = [];
  signAndSend: SignAndSend[] = [];
  textarea: Textarea;

  constructor(
    private _service: CardsService,
    private _snackBar: MatSnackBar,
    private signAndSendDialogRef: MatDialogRef<SignAndSendDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { url: string, image: string, cardId: string }
  ) {
    this.service = _service;
    this.snackBar = _snackBar;
  }

  ngOnInit() {
    this.image = this.data.image;
    this.url = this.data.url;
    this.cardId = this.data.cardId;

    this.loadSignAndSend();
  }

  loadSignAndSend() {
    this.service.getSignAndSend(this.cardId, this.image).then(data => {
      this.signAndSend = data;
      let maxCode: number = 0;
      data.forEach(sign => {
        if (sign.image == this.image) {
          let textarea = new Textarea(sign.code);
          textarea.left = sign.left;
          textarea.top = sign.top;
          textarea.width = sign.width;
          textarea.height = sign.height;
          textarea.limit = sign.limit;

          this.textareas.push(textarea);

          let textarea2 = new Textarea(sign.code);
          textarea2.left = sign.left;
          textarea2.top = sign.top;
          textarea2.width = sign.width;
          textarea2.height = sign.height;
          textarea2.limit = sign.limit;

          this.textareasForSaving.push(textarea2);

          if (maxCode < sign.code) {
            maxCode = sign.code;
          }
        }
      });
      if (maxCode >= this.textareaCount) {
        this.textareaCount = maxCode + 1;
      }
    })
  }

  addTextarea() {
    this.textareas.push(new Textarea(this.textareaCount));
    this.textareasForSaving.push(new Textarea(this.textareaCount));
    this.textareaCount++;
  }

  dragStarted(code: number) {
    this.focus(code);
  }

  dragEnded(code: number, event: CdkDragEnd) {
    this.textareasForSaving.forEach(textarea => {
      if (textarea.code == code) {
        const { offsetLeft, offsetTop } = event.source.element.nativeElement;
        textarea.left = Math.trunc(event.source.getFreeDragPosition().x) + offsetLeft;
        textarea.top = Math.trunc(event.source.getFreeDragPosition().y) + offsetTop;
      }
    })
  }

  click(code: number) {
    this.focus(code);
  }

  focus(code: number) {
    this.textareas.forEach(textarea => {
      if (textarea.code == code) {
        this.textarea = textarea;
      }
    });
  }

  save() {
    
    this.textareasForSaving.forEach((textarea) => {
      if (textarea.remove){
        this.signAndSend.forEach((sign, signIndex) => {
          if (textarea.code == sign.code){
            this.service.deleteSignAndSend(this.cardId, sign.id);
            this.signAndSend.splice(signIndex, 1);
          }
        });
      }
    });
    
    this.textareasForSaving.forEach(textarea => {
      let isFound: boolean = false;
      if (!textarea.remove){
        this.signAndSend.forEach(sign => {
          if (textarea.code == sign.code) {
            isFound = true;
            sign.left = textarea.left;
            sign.top = textarea.top;
            sign.width = textarea.width;
            sign.height = textarea.height;
            sign.limit = textarea.limit;
          }
        });
        if (!isFound) {
          let sign: SignAndSend = new SignAndSend();
          sign.image = this.image;
          sign.code = textarea.code;
          sign.left = textarea.left;
          sign.top = textarea.top;
          sign.width = textarea.width;
          sign.height = textarea.height;
          sign.limit = textarea.limit;
          this.signAndSend.push(sign);
        }
      }
    });
    
    this.signAndSend.forEach(sign => {
      if ((!sign.id) || (sign.id == '')) {
        this.service.addSignAndSend(this.cardId, sign).then(id => {
          sign.id = id;
        });
      }
      else {
        this.service.updateSignAndSend(this.cardId, sign);
      }
    });
    
    this.snackBar.open("Sign and Send Details Saved", "", {
      duration: 3000
    });
  }

  close() {
    this.signAndSendDialogRef.close();
  }

  widthKeyup(event: any) {
    this.updateWidth(Number(event.target.value));
  }

  widthChange(event: any) {
    this.updateWidth(Number(event.target.value));
  }

  heightKeyup(event: any) {
    this.updateHeight(Number(event.target.value));
  }

  heightChange(event: any) {
    this.updateHeight(Number(event.target.value));
  }

  limitKeyup(event: any) {
    this.updateLimit(Number(event.target.value));
  }

  limitChange(event: any) {
    this.updateLimit(Number(event.target.value));
  }

  remove() {
    this.textareas.forEach(textarea => {
      if (textarea.code == this.textarea.code) {
        textarea.remove = true;
      }
    });
    this.textareasForSaving.forEach(textarea => {
      if (textarea.code == this.textarea.code) {
        textarea.remove = true;
      }
    });

    this.textarea = null;
  }

  updateWidth(value: number) {
    this.textareas.forEach(textarea => {
      if (textarea.code == this.textarea.code) {
        textarea.width = value;
      }
    });
    this.textareasForSaving.forEach(textarea => {
      if (textarea.code == this.textarea.code) {
        textarea.width = value;
      }
    });
  }

  updateHeight(value: number) {
    this.textareas.forEach(textarea => {
      if (textarea.code == this.textarea.code) {
        textarea.height = value;
      }
    });
    this.textareasForSaving.forEach(textarea => {
      if (textarea.code == this.textarea.code) {
        textarea.height = value;
      }
    });
  }

  updateLimit(value: number) {
    this.textareas.forEach(textarea => {
      if (textarea.code == this.textarea.code) {
        textarea.limit = value;
      }
    });
    this.textareasForSaving.forEach(textarea => {
      if (textarea.code == this.textarea.code) {
        textarea.limit = value;
      }
    });
  }
}
