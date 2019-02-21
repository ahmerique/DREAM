import { Component, OnInit } from '@angular/core';
import { MessageService } from '../_services';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  lang: string;
  subscriptionLanguage: any;

  constructor(private messageService: MessageService
  ) {
    this.subscriptionLanguage = this.messageService.getMessage().subscribe(message => {
      if (message.text === 'changeLanguage') {
        this.lang = localStorage.getItem('language') ? localStorage.getItem('language') : 'fr';
      }
    });
  }

  ngOnInit() {
    this.lang = localStorage.getItem('language') ? localStorage.getItem('language') : 'fr';
  }
}
