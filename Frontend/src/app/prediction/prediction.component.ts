import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { LearningService } from '../learning.service'
@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnInit {
  perturbation = []
  wildtype=[]
  constructor(private dataService: DataService, private learningService: LearningService) { }
  dataTab = []
  @Input() dataSend: String;
  @Input() lengthData: number;
  @Input() id:number
  @Input() method: String;
  show: boolean = false;
  selectedOption1: String
  selectedOption2: String

  Show() {
    let perturbation = {
      pert1: this.selectedOption1,
      pert2: this.selectedOption2,
      id:this.id,
      method:this.method
    }
    console.log(perturbation)
    //appelle la fonction prediction de learning.service pour recuperer les données en cas de perturbation
    this.learningService.prediction(perturbation).subscribe(data => {
      this.dataTab = data.split(' ');
      this.perturbation=[]
      for (let i = 1; i < this.lengthData+1; i++) {
        this.perturbation.push({name:'G'+(i).toString(), value:(parseFloat(this.dataTab[i]).toFixed(2))})
      }
    });
    this.show = true
  }

  getData() {
    this.dataService.getData().subscribe(data => {
      console.log(data)
      this.dataTab = data.split(' ');
      this.wildtype=[]
      for (let i = 1; i < this.lengthData+1; i++) {
        this.wildtype.push({name:'G'+(i).toString(), value:(parseFloat(this.dataTab[i]).toFixed(2))})
      }
    });
  }

  ngOnInit() {
    this.getData();
    for (let i = 0; i < this.lengthData; i++) {
      this.perturbation.push({name:'G'+(i+1).toString()})
    }
  }

}
