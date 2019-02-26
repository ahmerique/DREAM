import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../_services';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  lang: String;
  subscriptionLanguage: any;

  constructor(private route: ActivatedRoute, private messageService: MessageService,
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
