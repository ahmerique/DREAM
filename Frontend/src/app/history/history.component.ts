import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  _history = ['modèle 1', 'modèle 2'];

  constructor() { }

  ngOnInit() {
  }

  loadModel(oldModel): void {

  }

}
