import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { LearningService } from '../learning.service';
import { DataService } from '../data.service';
@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class LearningComponent implements OnInit {

  constructor(private learningService: LearningService, private dataService: DataService) { }
  data = [{ id: 0, name: '', type: [] }];
  table = [];
  result: boolean = false;
  learning: String;
  @Input() id: number;
  @Input() dataChange: any;
  links = [];
  selectedType = {};
  selectedLearning: string;
  dataString: String;
  dataSend: String;
  dataTab: any;
  lengthNumber: number = 10;//nombre de données dans la table utilisée
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
    this.links = [{ 'source': 1, 'target': 2, 'type': 'unknown' },
    { 'source': 1, 'target': 3, 'type': 'unknown' },
    { 'source': 1, 'target': 4, 'type': 'unknown' },
    { 'source': 5, 'target': 2, 'type': 'unknown' },
    { 'source': 5, 'target': 3, 'type': 'unknown' },
    { 'source': 5, 'target': 4, 'type': 'unknown' },
    { 'source': 5, 'target': 6, 'type': 'unknown' },
    { 'source': 5, 'target': 7, 'type': 'unknown' },
    { 'source': 5, 'target': 8, 'type': 'unknown' },
    { 'source': 5, 'target': 9, 'type': 'unknown' },
    { 'source': 5, 'target': 10, 'type': 'unknown' },
    { 'source': 5, 'target': 11, 'type': 'unknown' },
    { 'source': 5, 'target': 12, 'type': 'unknown' },
    { 'source': 5, 'target': 13, 'type': 'unknown' },
    { 'source': 5, 'target': 14, 'type': 'unknown' },
    { 'source': 5, 'target': 15, 'type': 'unknown' },
    { 'source': 5, 'target': 16, 'type': 'unknown' },
    { 'source': 5, 'target': 17, 'type': 'unknown' },
    { 'source': 5, 'target': 18, 'type': 'unknown' },
    { 'source': 5, 'target': 19, 'type': 'unknown' },
    { 'source': 5, 'target': 20, 'type': 'unknown' },
    { 'source': 5, 'target': 21, 'type': 'unknown' },
    { 'source': 5, 'target': 22, 'type': 'unknown' },
    { 'source': 10, 'target': 37, 'type': 'unknown' },
    { 'source': 10, 'target': 44, 'type': 'unknown' },
    { 'source': 10, 'target': 50, 'type': 'unknown' },
    { 'source': 15, 'target': 14, 'type': 'unknown' },
    { 'source': 23, 'target': 24, 'type': 'unknown' },
    { 'source': 25, 'target': 7, 'type': 'unknown' },
    { 'source': 26, 'target': 27, 'type': 'unknown' },
    { 'source': 26, 'target': 28, 'type': 'unknown' },
    { 'source': 26, 'target': 29, 'type': 'unknown' },
    { 'source': 26, 'target': 30, 'type': 'unknown' },
    { 'source': 26, 'target': 31, 'type': 'unknown' },
    { 'source': 26, 'target': 33, 'type': 'unknown' },
    { 'source': 26, 'target': 34, 'type': 'unknown' },
    { 'source': 26, 'target': 35, 'type': 'unknown' },
    { 'source': 36, 'target': 37, 'type': 'unknown' },
    { 'source': 37, 'target': 1, 'type': 'unknown' },
    { 'source': 37, 'target': 8, 'type': 'unknown' },
    { 'source': 37, 'target': 10, 'type': 'unknown' },
    { 'source': 37, 'target': 23, 'type': 'unknown' },
    { 'source': 37, 'target': 24, 'type': 'unknown' },
    { 'source': 37, 'target': 25, 'type': 'unknown' },
    { 'source': 37, 'target': 29, 'type': 'unknown' },
    { 'source': 37, 'target': 47, 'type': 'unknown' },
    { 'source': 37, 'target': 48, 'type': 'unknown' },
    { 'source': 37, 'target': 51, 'type': 'unknown' },
    { 'source': 37, 'target': 59, 'type': 'unknown' },
    { 'source': 37, 'target': 60, 'type': 'unknown' },
    { 'source': 37, 'target': 61, 'type': 'unknown' },
    { 'source': 37, 'target': 62, 'type': 'unknown' },
    { 'source': 37, 'target': 64, 'type': 'unknown' },
    { 'source': 37, 'target': 67, 'type': 'unknown' },
    { 'source': 37, 'target': 68, 'type': 'unknown' },
    { 'source': 37, 'target': 69, 'type': 'unknown' },
    { 'source': 37, 'target': 70, 'type': 'unknown' },
    { 'source': 37, 'target': 71, 'type': 'unknown' },
    { 'source': 37, 'target': 72, 'type': 'unknown' },
    { 'source': 37, 'target': 73, 'type': 'unknown' },
    { 'source': 37, 'target': 74, 'type': 'unknown' },
    { 'source': 37, 'target': 75, 'type': 'unknown' },
    { 'source': 38, 'target': 9, 'type': 'unknown' },
    { 'source': 38, 'target': 39, 'type': 'unknown' },
    { 'source': 40, 'target': 41, 'type': 'unknown' },
    { 'source': 42, 'target': 1, 'type': 'unknown' },
    { 'source': 43, 'target': 44, 'type': 'unknown' },
    { 'source': 43, 'target': 45, 'type': 'unknown' },
    { 'source': 44, 'target': 10, 'type': 'unknown' },
    { 'source': 44, 'target': 31, 'type': 'unknown' },
    { 'source': 44, 'target': 50, 'type': 'unknown' },
    { 'source': 44, 'target': 62, 'type': 'unknown' },
    { 'source': 44, 'target': 63, 'type': 'unknown' },
    { 'source': 44, 'target': 64, 'type': 'unknown' },
    { 'source': 45, 'target': 44, 'type': 'unknown' },
    { 'source': 44, 'target': 46, 'type': 'unknown' },
    { 'source': 46, 'target': 4, 'type': 'unknown' },
    { 'source': 46, 'target': 9, 'type': 'unknown' },
    { 'source': 46, 'target': 10, 'type': 'unknown' },
    { 'source': 46, 'target': 16, 'type': 'unknown' },
    { 'source': 46, 'target': 17, 'type': 'unknown' },
    { 'source': 46, 'target': 18, 'type': 'unknown' },
    { 'source': 46, 'target': 22, 'type': 'unknown' },
    { 'source': 46, 'target': 24, 'type': 'unknown' },
    { 'source': 46, 'target': 37, 'type': 'unknown' },
    { 'source': 46, 'target': 47, 'type': 'unknown' },
    { 'source': 46, 'target': 48, 'type': 'unknown' },
    { 'source': 46, 'target': 49, 'type': 'unknown' },
    { 'source': 46, 'target': 50, 'type': 'unknown' },
    { 'source': 46, 'target': 51, 'type': 'unknown' },
    { 'source': 46, 'target': 52, 'type': 'unknown' },
    { 'source': 46, 'target': 53, 'type': 'unknown' },
    { 'source': 46, 'target': 54, 'type': 'unknown' },
    { 'source': 46, 'target': 55, 'type': 'unknown' },
    { 'source': 46, 'target': 56, 'type': 'unknown' },
    { 'source': 46, 'target': 57, 'type': 'unknown' },
    { 'source': 46, 'target': 58, 'type': 'unknown' },
    { 'source': 46, 'target': 59, 'type': 'unknown' },
    { 'source': 46, 'target': 60, 'type': 'unknown' },
    { 'source': 46, 'target': 61, 'type': 'unknown' },
    { 'source': 54, 'target': 55, 'type': 'unknown' },
    { 'source': 54, 'target': 82, 'type': 'unknown' },
    { 'source': 55, 'target': 54, 'type': 'unknown' },
    { 'source': 57, 'target': 56, 'type': 'unknown' },
    { 'source': 62, 'target': 10, 'type': 'unknown' },
    { 'source': 62, 'target': 50, 'type': 'unknown' },
    { 'source': 63, 'target': 19, 'type': 'unknown' },
    { 'source': 63, 'target': 20, 'type': 'unknown' },
    { 'source': 63, 'target': 41, 'type': 'unknown' },
    { 'source': 63, 'target': 51, 'type': 'unknown' },
    { 'source': 63, 'target': 59, 'type': 'unknown' },
    { 'source': 63, 'target': 60, 'type': 'unknown' },
    { 'source': 63, 'target': 61, 'type': 'unknown' },
    { 'source': 63, 'target': 75, 'type': 'unknown' },
    { 'source': 63, 'target': 78, 'type': 'unknown' },
    { 'source': 63, 'target': 79, 'type': 'unknown' },
    { 'source': 63, 'target': 80, 'type': 'unknown' },
    { 'source': 64, 'target': 28, 'type': 'unknown' },
    { 'source': 64, 'target': 94, 'type': 'unknown' },
    { 'source': 64, 'target': 95, 'type': 'unknown' },
    { 'source': 65, 'target': 66, 'type': 'unknown' },
    { 'source': 66, 'target': 65, 'type': 'unknown' },
    { 'source': 67, 'target': 68, 'type': 'unknown' },
    { 'source': 67, 'target': 69, 'type': 'unknown' },
    { 'source': 69, 'target': 67, 'type': 'unknown' },
    { 'source': 69, 'target': 68, 'type': 'unknown' },
    { 'source': 72, 'target': 23, 'type': 'unknown' },
    { 'source': 72, 'target': 24, 'type': 'unknown' },
    { 'source': 72, 'target': 76, 'type': 'unknown' },
    { 'source': 72, 'target': 77, 'type': 'unknown' },
    { 'source': 73, 'target': 89, 'type': 'unknown' },
    { 'source': 75, 'target': 24, 'type': 'unknown' },
    { 'source': 82, 'target': 54, 'type': 'unknown' },
    { 'source': 82, 'target': 55, 'type': 'unknown' },
    { 'source': 83, 'target': 19, 'type': 'unknown' },
    { 'source': 83, 'target': 20, 'type': 'unknown' },
    { 'source': 83, 'target': 49, 'type': 'unknown' },
    { 'source': 83, 'target': 84, 'type': 'unknown' },
    { 'source': 83, 'target': 85, 'type': 'unknown' },
    { 'source': 85, 'target': 4, 'type': 'unknown' },
    { 'source': 85, 'target': 9, 'type': 'unknown' },
    { 'source': 85, 'target': 11, 'type': 'unknown' },
    { 'source': 85, 'target': 12, 'type': 'unknown' },
    { 'source': 85, 'target': 13, 'type': 'unknown' },
    { 'source': 85, 'target': 16, 'type': 'unknown' },
    { 'source': 85, 'target': 17, 'type': 'unknown' },
    { 'source': 85, 'target': 18, 'type': 'unknown' },
    { 'source': 85, 'target': 25, 'type': 'unknown' },
    { 'source': 85, 'target': 38, 'type': 'unknown' },
    { 'source': 85, 'target': 39, 'type': 'unknown' },
    { 'source': 85, 'target': 58, 'type': 'unknown' },
    { 'source': 85, 'target': 84, 'type': 'unknown' },
    { 'source': 85, 'target': 86, 'type': 'unknown' },
    { 'source': 85, 'target': 87, 'type': 'unknown' },
    { 'source': 85, 'target': 88, 'type': 'unknown' },
    { 'source': 87, 'target': 86, 'type': 'unknown' },
    { 'source': 90, 'target': 28, 'type': 'unknown' },
    { 'source': 90, 'target': 70, 'type': 'unknown' },
    { 'source': 91, 'target': 21, 'type': 'unknown' },
    { 'source': 91, 'target': 92, 'type': 'unknown' },
    { 'source': 92, 'target': 28, 'type': 'unknown' },
    { 'source': 93, 'target': 28, 'type': 'unknown' },
    { 'source': 93, 'target': 64, 'type': 'unknown' },
    { 'source': 93, 'target': 94, 'type': 'unknown' },
    { 'source': 93, 'target': 95, 'type': 'unknown' },
    { 'source': 96, 'target': 10, 'type': 'unknown' },
    { 'source': 96, 'target': 21, 'type': 'unknown' },
    { 'source': 96, 'target': 62, 'type': 'unknown' },
    { 'source': 96, 'target': 97, 'type': 'unknown' },
    { 'source': 98, 'target': 99, 'type': 'unknown' },
    { 'source': 99, 'target': 54, 'type': 'unknown' },
    { 'source': 99, 'target': 54, 'type': 'unknown' },
    { 'source': 99, 'target': 55, 'type': 'unknown' },
    { 'source': 100, 'target': 10, 'type': 'unknown' },
    { 'source': 100, 'target': 98, 'type': 'unknown' }];
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
        name: this.data[this.id].name,
        data: JSON.stringify(this.selectedType),
        learning: this.selectedLearning,
        timeseries: JSON.stringify(timeseries)
      }
    }
    else {
      dataSent = {
        name: this.data[this.id].name,
        data: JSON.stringify(this.selectedType),
        learning: this.selectedLearning
      }
    }
    this.result = false;

    this.learningService.learn(dataSent).subscribe(data => {
      this.dataString = data;

      console.log(this.dataString);
      this.Learn(dataSent);
      console.log(this.learning);

    });

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
      this.result = true;

    });
  }

}
