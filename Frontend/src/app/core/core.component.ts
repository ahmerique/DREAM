import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})

export class CoreComponent implements OnInit {

  constructor(private dataService: DataService) { }

  hauteur = 200;
  selectedDevice: String;
  addfile = false;
  addgraph = false;
  data = [{ id: 0, name: '', type: [] }];
  dataToSelect=[{ id: 0, name: '', type: [] }];
  dataTab = [];
  id: number;
  dataString: string = '';
  selectedOption = 1;
  selectedGraphType: String;
  selectedGraphType2: String;
  chart: Chart;
  chart2: Chart;
  displayData = []
  displayData2 = []

  lengthData = 10

  xAxis = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];


  options = [
    { name: 'option1', value: 1 },
    { name: 'option2', value: 2 }
  ];
  getDataBase() {
    this.dataService.getDataBase().subscribe(data => {
      this.dataString = data,
        this.data = JSON.parse(this.dataString.replace(/'/g, "\"")),
        console.log(this.data),
        this.dataToSelect=this.data
        this.selectedGraphType = this.data[0]['type'][0]
      this.getData();
      this.updateSelectData();
    });
    
  }
  updateSelectData(){
    for (let i=0;i<this.dataToSelect.length;i++){
      for(let j=0;j<this.dataToSelect[i]['type'].length;j++){
        if (this.dataToSelect[i]['type'][j]=='wildtype'){
          this.dataToSelect[i]['type'].splice(j,1)
        }
      }
    };
  }
  getData() {

    this.dataService.displayData({ donnee: this.data[this.selectedOption - 1]['name'], type: this.selectedGraphType }).subscribe(data => {
      this.dataString = data,
        this.displayData = JSON.parse(this.dataString.replace(/'/g, "\""))
        if (this.displayData[0]['label']!='Time'){
      this.chart.options.title.display = true
      this.chart.options.title.text = this.data[this.selectedOption - 1].name + ' ' + this.selectedGraphType;
      this.chart.data.labels = this.xAxis;
      this.chart.data.datasets = this.displayData;
      this.chart.update();
        }
        else{
          this.chart.options.title.display = true
          this.chart.data.labels = this.displayData[0]['data'];
          this.chart.options.title.text = this.data[this.selectedOption - 1].name + ' ' + this.selectedGraphType;
          this.chart.data.datasets = this.displayData.slice(1,this.displayData.length)
          this.chart.update();
        }
    });
  }



  createGraph() {
    this.chart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: this.xAxis,
        datasets: this.displayData
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

  }
  ngOnInit() {
    this.getDataBase()
    this.createGraph();

  }


  addFile() {
    !this.addfile ? this.addfile = true : this.addfile = false;
  }

  addGraph() {
    !this.addgraph ? this.addgraph = true : this.addgraph = false;

  }

}
