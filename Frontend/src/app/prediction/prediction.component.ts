import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import {LearningService} from '../learning.service'
@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnInit {
  Gname = [{ name: "G1", value: 0.42 }, { name: "G2", value: 0.42 }, { name: "G3", value: 0.42 }, { name: "G4", value: 0.42 }, { name: "G5", value: 0.42 }, { name: "G6", value: 0.42 }, { name: "G7", value: 0.42 }, { name: "G8", value: 0.42 }, { name: "G9", value: 0.42 }, { name: "G10", value: 0.42 }]
  constructor(private dataService: DataService, private learningService : LearningService) { }
  dataTab = []
  @Input() dataSend:String;
  show: boolean = false;
  selectedOption1: String
  selectedOption2: String

  Show() {
    let perturbation={
      pert1 : this.selectedOption1,
      pert2: this.selectedOption2
    }
    console.log(perturbation)
    //appelle la fonction prediction de learning.service pour recuperer les données en cas de perturbation
    this.learningService.prediction(perturbation).subscribe(data => {
      this.dataTab = data.split('\t');
      for (let i = 0; i < 10; i++) {
        this.Gname[i]['value'] = this.dataTab[i];
      }
    });
    if (!this.show) {
      this.show = true;
    }
    else {
      this.show = false;

    }
  }

  getData() {
    console.log(this.dataSend)
    this.dataService.getData().subscribe(data => {
      this.dataTab = data.split('\t');
      for (let i = 0; i < 10; i++) {
        this.Gname[i]['value'] = this.dataTab[i];
      }
    });
    console.log(this.dataTab);
  }

  ngOnInit() {
    this.getData();
  }

}
