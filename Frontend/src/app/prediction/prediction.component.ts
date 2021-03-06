import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../_services/data.service';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { LearningService } from '../_services/learning.service';
@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnInit {
  perturbation = []
  wildtype = []
  constructor(private dataService: DataService, private learningService: LearningService) { }
  dataTab = []
  @Input() dataSend: String;
  @Input() lengthData: number;
  @Input() id: number
  @Input() method: String;
  @Input() data;
  @Input() lang;

  show: boolean = false;
  selectedOption1: String
  selectedOption2: String

  getDataId() {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i]['id'] == this.id) {
        return i
      }
    }
    return 'erreur qui ne devrait pas arriver'
  }
  Show() {
    let perturbation = {
      pert1: this.selectedOption1,
      pert2: this.selectedOption2,
      id: this.id,
      method: this.method
    }
    //appelle la fonction prediction de learning.service pour recuperer les données en cas de perturbation
    this.learningService.prediction(perturbation).subscribe(data => {
      this.dataTab = data.split(' ');
      this.perturbation = []
      for (let i = 1; i < this.lengthData + 1; i++) {
        this.perturbation.push({ name: 'G' + (i).toString(), value: (parseFloat(this.dataTab[i]).toFixed(2)) })
      }
    });
    this.show = true
  }

  getData() {
    this.dataService.getData({ id: this.id }).subscribe(data => {
      this.dataTab = data.split(' ');
      this.wildtype = []
      for (let i = 1; i < this.lengthData + 1; i++) {
        this.wildtype.push({ name: 'G' + (i).toString(), value: (parseFloat(this.dataTab[i]).toFixed(2)) })
      }
    });
  }

  ngOnInit() {


    this.getData();
    for (let i = 0; i < this.lengthData; i++) {
      this.perturbation.push({ name: 'G' + (i + 1).toString() })
    }
  }

}
