import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  _currentUserData = ['data1.tsv', 'data2222.csv'];
  _import = false;
  _delete = false;
  constructor() { }

  ngOnInit() {
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
