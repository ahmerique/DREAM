import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-donnees',
  templateUrl: './donnees.component.html',
  styleUrls: ['./donnees.component.css']
})
export class DonneesComponent implements OnInit {
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
