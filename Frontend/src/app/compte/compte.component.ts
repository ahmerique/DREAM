import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.css']
})
export class CompteComponent implements OnInit {

  _pseudo = 'Bioman';
  _mail = 'Bioman@coucou.io'
  constructor() { }

  ngOnInit() {
  }

}
