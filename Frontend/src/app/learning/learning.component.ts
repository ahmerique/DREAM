import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { LearningService } from '../learning.service';
import { DataService } from '../data.service';
import { AuthenticationService, MessageService } from '../_services';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class LearningComponent implements OnInit {

  constructor(private learningService: LearningService, private authenticationService: AuthenticationService,
    private dataService: DataService) { }
  loading: boolean = false;
  data = [{ id: 0, name: '', type: [] }];
  table = [];
  result: boolean = false;
  learning: String;
  @Input() id: number;
  @Input() dataChange: any;
  @Input() tabId: number;
  links = [];
  selectedType = {};
  selectedLearning: string;
  dataString: String;
  dataSend: String;
  dataTab: any;
  parameters = false;
  lengthNumber: number = 10;//nombre de données dans la table utilisée
  learningList = []
  model=''
  gold=''

  ngOnInit() {
    this.getDataBase();
  }

  getDataBase() {
    this.dataService.getDataBase().subscribe(data => {
      this.dataString = data,
        this.data = JSON.parse(this.dataString.replace(/'/g, "\"")),
        this.updateSelectData();

    })
  }
  debug() {
    console.log(this.selectedType[0])
  }
  updateSelectData() {
    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < this.data[i]['type'].length; j++) {
        if (this.data[i]['type'][j] === 'wildtype') {
          this.data[i]['type'].splice(j, 1);
        }
      }
    }
  }

  Result() {
    console.log((this.selectedLearning))
    if (!(this.selectedLearning)) {
      this.parameters = true
      this.result = false;

    }
    else {
      this.parameters = false

      let dataSent = {}
      let timeseries = []
      for (let j = 0; j < this.dataChange.length; j++) {
        timeseries.push({
          data: this.dataChange[j]['data'],
          label: this.dataChange[j]['label']
        })
      }
      if (JSON.stringify(this.selectedType).includes("timeseries")) {
        dataSent = {
          name: this.getDataName(),
          data: JSON.stringify(this.selectedType),
          learning: this.selectedLearning,
          timeseries: JSON.stringify(timeseries)
        }
      }

      else {
        dataSent = {
          name: this.getDataName(),
          data: JSON.stringify(this.selectedType),
          learning: this.selectedLearning
        }
      }
      this.result = false;

      this.learningService.learn(dataSent).subscribe(data => {
        this.loading = true;
        this.dataString = data;
        console.log(this.dataString);
        this.Learn(dataSent);
        this.getRealModel(dataSent);
        this.getGold(dataSent);


      });
    }
  }

  updateLearning() {
    let listSelected = []
    this.learningList = []
    this.selectedLearning=''
    for (let j = 0; j < Object.keys(this.selectedType).length; j++) {
      listSelected += this.selectedType[Object.keys(this.selectedType)[j]]
    }
    if (listSelected.includes("knockouts")) {
      this.learningList.push('Ecart relatif')
      this.learningList.push('Ecart absolu')
      this.learningList.push('Ecart relatif et absolu')

    }
    if (listSelected.includes("timeseries")) {
      this.learningList.push('Reseau de Neurones')
      this.learningList.push('XGBoost')
      this.learningList.push('Random Forest')

    }
    if (listSelected.includes("multifactorial")) {
      this.learningList.push('ML Disruptif')

    }
    if (listSelected.includes("knockdowns")) {
      this.learningList.push('Ecart absolu')
      this.learningList.push('Ecart relatif')

    }
    this.learningList = this.cleanArray(this.learningList)

  }
  cleanArray(array) {
    var i, j, len = array.length, out = [], obj = {};
    for (i = 0; i < len; i++) {
      obj[array[i]] = 0;
    }
    for (j in obj) {
      out.push(j);
    }
    return out;
  }
  getDataName() {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i]['id'] == this.id) {
        return this.data[i]['name']
      }
    }
    return 'erreur qui ne devrait pas arriver'
  }
  getDataId() {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i]['id'] == this.id) {
        return i
      }
    }
    return 0
  }
  addData() {
    this.table.push(this.table.length)
  }
  deleteData(x) {
    this.table.pop()
    delete this.selectedType[this.table.length];
  }
  Learn(dataSent) {
    this.learningService.createGraph(dataSent).subscribe(data => {
      console.log(data),
        this.links = JSON.parse((data.replace(/'/g, '"')));
      this.loading = false;
      this.result = true;

    });
  }
  getRealModel(dataSent){

    this.learningService.getRealModel(dataSent).subscribe(data => {
      console.log(data)
        this.model = data;
    });
  }
  getGold(dataSent){

    this.learningService.getGold(dataSent).subscribe(data => {
      console.log(data)
        this.gold = data;
    });
  }

  saveData() {
    let json = {
      'tsv': this.data[this.tabId].name,
      'model': this.selectedLearning,
      'results': JSON.stringify([this.links, this.data, this.lengthNumber, this.id, this.dataString])
    }

    this.authenticationService.addQueryHistory2(json).subscribe(
      data => {
        console.log(data.message);
      },
      error => {
        console.log(error);
      });
  }


}
