import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit {

  _historique = ['modèle1', 'modèle2'];

  constructor() { }

  ngOnInit() {
  }

}
