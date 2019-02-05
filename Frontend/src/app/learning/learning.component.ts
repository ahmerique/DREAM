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
  @Input() dataChange:any;
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
        console.log(this.data)

    })
  }
  Result() {
    this.links = [{'source': 1, 'target': 2, 'type': 'unknown'},
     {'source': 2, 'target': 4, 'type': 'unknown'},
     {'source': 2, 'target': 7, 'type': 'unknown'},
     {'source': 2, 'target': 8, 'type': 'unknown'},
     {'source': 3, 'target': 4, 'type': 'unknown'},
     {'source': 3, 'target': 5, 'type': 'unknown'},
     {'source': 4, 'target': 5, 'type': 'unknown'},
     {'source': 5, 'target': 2, 'type': 'unknown'},
     {'source': 5, 'target': 3, 'type': 'unknown'},
     {'source': 6, 'target': 7, 'type': 'unknown'},
     {'source': 7, 'target': 6, 'type': 'unknown'},
     {'source': 9, 'target': 5, 'type': 'unknown'},
     {'source': 10, 'target': 3, 'type': 'unknown'}];
    let dataSent = {}
    let timeseries=[]
    for (let j=0;j<this.dataChange.length;j++){
    timeseries.push({data:this.dataChange[j]['data'],
    label: this.dataChange[j]['label']})
    }
    if (JSON.stringify(this.selectedType).includes("timeseries")) {
      dataSent = {
        name: this.data[this.id].name,
        data: JSON.stringify(this.selectedType),
        learning: this.selectedLearning,
        timeseries:JSON.stringify(timeseries)
            }
    }
    else {
      dataSent = {
        name: this.data[this.id].name,
        data: JSON.stringify(this.selectedType),
        learning: this.selectedLearning
      }
    }

    this.learningService.learn(dataSent).subscribe(data => {
      this.dataString = data;

      console.log(this.dataString);
      this.result = true;
      this.learning = this.Learn();
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
  Learn() {
    console.log(this.dataChange)

    return "coming soon"
  }
}
