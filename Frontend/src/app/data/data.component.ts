import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from '../_services';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  _currentUserData = ['data1.tsv', 'data2222.csv'];
  _import = false;
  _delete = false;
  lang: string;
  subscriptionLanguage: any;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
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

  importData(): void {
    this._import = true;
    this._delete = false;
  }

  allowDelete(): void {
    this._import = false;
    this._delete = true;
  }
}
