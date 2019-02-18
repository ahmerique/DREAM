import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css']
})
export class ModelComponent implements OnInit {
  @Input() model;
  matrice;
  @Input() gold;
  @Input() lang;
  flagScore:Boolean=false;
  matriceGold;
  @Input() score;
  
  constructor() { }

  ngOnInit() {
    console.log(this.gold)
    this.matrice = (JSON.parse(this.model))
    this.matriceGold = (JSON.parse(this.gold))
    this.Actualise();
  }
  showScore(){
    this.flagScore=true;
  }
  Actualise() {
    this.flagScore=false;
    console.log(this.flagScore)
    for (let j = 0; j < this.matriceGold.length; j++) {
      for (let i = 0; i < this.matriceGold[j].length; i++) {

        if (this.matriceGold[j][i] != this.matrice[j][i]) {
          if (this.matrice[j][i] == 1) {
            this.matrice[j][i] = 'fp'
          }
          else {
            this.matrice[j][i] = 'fn'

          }
        }
        else {
          if (this.matrice[j][i] == 1) {
            this.matrice[j][i] = 'vp'
          }
          else {
            this.matrice[j][i] = 'vn'

          }

        }
      }
    }
  }

}
