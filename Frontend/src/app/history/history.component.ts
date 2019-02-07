import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  _history = [];

  constructor(private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.authenticationService.getQueryHistory().subscribe(
      data => {
        this._history = data.data;
      },
      error => {
        console.log(error);
      });
  }

  loadQuery(query_id): void {
    this.authenticationService.postQueryHistory(query_id).subscribe(
      data => {
        console.log(data.data);
      },
      error => {
        console.log(error);
      });
  }

  deleteQuery(query_id): void {
    this.authenticationService.deleteQueryHistory(query_id).subscribe(
      data => {
        console.log(data.message);
        this.authenticationService.getQueryHistory().subscribe(
          data2 => {
            this._history = data2.data;
          },
          error => {
            console.log(error);
          });
      },
      error => {
        console.log(error);
      });
  }
}
