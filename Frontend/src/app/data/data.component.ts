import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  _currentUserData = ['data1.tsv', 'data2222.csv'];
  _import = false;
  _delete = false;
  lang;
  constructor(        private route: ActivatedRoute,private router: Router    ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.lang = params['id']; 

   });
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
