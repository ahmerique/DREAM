import { Component, OnInit, Input } from '@angular/core';
import { LearningService } from '../_services/learning.service';

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
  flagScore: Boolean = false;
  matriceGold;
  score;

  constructor(private learningService: LearningService) { }

  ngOnInit() {
    this.matrice = (JSON.parse(this.model))
    this.matriceGold = (JSON.parse(this.gold))
    this.Actualise();
    this.getScore();
  }
  showScore() {
    this.flagScore = true;
  }
  Actualise() {
    this.flagScore = false;
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
  getScore() {
    let dataSent = {
      matrice: this.matrice,
      gold: this.matriceGold
    }
    this.learningService.getScore(dataSent).subscribe(data => {
      this.score = data;
    });
  }
}
