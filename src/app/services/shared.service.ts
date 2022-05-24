import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private searchInfo: BehaviorSubject<string>;
  private eventInfo: BehaviorSubject<string>;
  private recipientInfo: BehaviorSubject<string>;
  private statusInfo: BehaviorSubject<string>;

  constructor() { 
    this.searchInfo = new BehaviorSubject<string>('');
    this.eventInfo = new BehaviorSubject<string>('');
    this.recipientInfo = new BehaviorSubject<string>('');
    this.statusInfo = new BehaviorSubject<string>('');
  }

  setSearchValue(newValue): void {
    this.searchInfo.next(newValue);
  }

  getSearchValue(): Observable<string> {
    return this.searchInfo.asObservable();
  }

  setEventValue(newValue): void {
    this.eventInfo.next(newValue);
  }

  getEventValue(): Observable<string> {
    return this.eventInfo.asObservable();
  }

  setRecipientValue(newValue): void {
    this.recipientInfo.next(newValue);
  }

  getRecipientValue(): Observable<string> {
    return this.recipientInfo.asObservable();
  }

  setStatusValue(newValue): void {
    this.statusInfo.next(newValue);
  }

  getStatustValue(): Observable<string> {
    return this.statusInfo.asObservable();
  }
}
