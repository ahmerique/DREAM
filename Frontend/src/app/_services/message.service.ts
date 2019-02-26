import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private _subject = new Subject<any>();

  constructor() { }

  sendMessage(message: string) {
    this._subject.next({ text: message });
  }

  clearMessage() {
    this._subject.next();
  }

  getMessage(): Observable<any> {
    return this._subject.asObservable();
  }

}
