import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  storage: AngularFireStorage;

  constructor(private _storage: AngularFireStorage) { 
    this.storage = _storage;
  }

  getRandomString(): string {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < 20; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  uploadRef(id: string): AngularFireStorageReference{
    let fileId = this.getRandomString();
    return this.storage.ref('cards/' + id + '/' + fileId);
  }

  uploadFile(file: File, ref: AngularFireStorageReference): AngularFireUploadTask{
    return ref.put(file);
  }

  deleteFile(link: string){
    this.storage.ref(link).delete();
    this.storage.ref(link + environment.imageSize.small).delete();
    this.storage.ref(link + environment.imageSize.medium).delete();
    this.storage.ref(link + environment.imageSize.large).delete();
  }

  async getDownloadURL(link: string): Promise<string>{
    return new Promise((resolve, rejects) => { 
      this.storage.ref(link).getDownloadURL().subscribe(
        url => {
          resolve(url);
        },
        err => {
          rejects(err);
        }
      );
    });
  }
}
