import { Injectable } from '@angular/core';

import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private messageService: MessageService) { }

  setLanguage(language: string) {
    if (language === 'fr') {
      localStorage.removeItem('language');
      console.log('french language');
    } else if (language === 'en') {
      localStorage.setItem('language', 'en');
      console.log('english language');
    }
    this.messageService.sendMessage('changeLanguage');
  }
}
