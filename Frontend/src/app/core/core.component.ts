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
  dataToSelect = [{ id: 0, name: '', type: [] }];
  dataTab = [];
  id: number;
  dataString: string = '';
  selectedOption = 1;
  selectedGraphType: String;
  selectedGraphType2: String;
  chart: Chart;
  chart2: Chart;
  displayData = []

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
        this.dataToSelect = this.data
      this.selectedGraphType = this.data[0]['type'][0]
      this.getData();
      this.updateSelectData();
    });

  }
  updateSelectData() {
    for (let i = 0; i < this.dataToSelect.length; i++) {
      for (let j = 0; j < this.dataToSelect[i]['type'].length; j++) {
        if (this.dataToSelect[i]['type'][j] == 'wildtype') {
          this.dataToSelect[i]['type'].splice(j, 1)
        }
      }
    };
  }
  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  getData() {

    this.dataService.displayData({ donnee: this.data[this.selectedOption - 1]['name'], type: this.selectedGraphType }).subscribe(data => {
      this.dataString = data,
        this.displayData = JSON.parse(this.dataString.replace(/'/g, "\""))
      for (let j = 0; j < this.displayData.length; j++) {
        let colorline=this.getRandomColor();
        this.displayData[j]['backgroundColor'] = ['rgba(255,0,0,0)'],
          this.displayData[j]['borderColor'] = [colorline]
      }
      if (this.displayData[0]['label'] != 'Time') {

        this.chart.options.title.display = true
        this.chart.options.title.text = this.data[this.selectedOption - 1].name + ' ' + this.selectedGraphType;
        this.chart.data.labels = this.xAxis;
        this.chart.data.datasets = this.displayData;
        this.chart.update();
      }
      else {
        this.chart.options.title.display = true
        this.chart.data.labels = this.displayData[0]['data'];
        this.chart.options.title.text = this.data[this.selectedOption - 1].name + ' ' + this.selectedGraphType;
        this.chart.data.datasets = this.displayData.slice(1, this.displayData.length)
        this.chart.update();
      }
    });
  }


  changeValueGraph() {

    if (!!this.chart.chart.getElementAtEvent(event)[0]) {
      console.log(this.displayData)
      if (this.displayData[0]['label'] == 'Time') {
        let y = this.chart.chart.getElementAtEvent(event)[0]['_model']['y']
        let index = this.chart.chart.getElementAtEvent(event)[0]['_index'];
        let number = this.chart.chart.getElementAtEvent(event)[0]['_datasetIndex'];
        var value = prompt("choose new value")
        if (parseFloat(value) >= 0) {
          this.displayData[number + 1]['data'][index] = value
          this.chart.data.datasets = this.displayData.slice(1, this.displayData.length)
          this.chart.update();
        } else {
          console.log("you need a value")
        }


      }
      else {
        console.log("you can't change data")
      }
    }
    else {
      console.log("click on a data")
    }
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
      },
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
