import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Chart } from 'chart.js';
//import { ConsoleReporter } from 'jasmine';

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
  dataToSelect = [{ id: 0, name: '', type: [] }];// egal a data, sans les timeseries (pour le second affichage)
  dataTab = [];
  id: number;
  idofdata: string = '1';
  selectedOption = 1;
  selectedGraphType = "timeseries";
  selectedGraphType2 = "knockdowns";
  chart: Chart;
  chart2: Chart;
  displayData = []
  displayData2 = []
  listData2 = []
  setColor2 = ['Aqua', 'Blue', 'Fuchsia', 'Green', 'Lime', 'Navy', 'Olive', 'Purple', 'Teal', 'Yellow']
  setColor = ["#FF0000", "#A02831", "#C24040", "#F6745A", "#FDD784", "#FF5900", "#FF9300", "black", "blue", "green", 'purple']
  lengthData = 10;

  getDataBase() {
    this.dataService.getDataBase().subscribe(data => {
      this.data = JSON.parse(data.replace(/'/g, "\""));
      this.dataToSelect = this.data;
      this.getData();
      this.getData2();
      this.updateSelectData();
    });
  }

  updateSelectData() {
    for (let i = 0; i < this.dataToSelect.length; i++) {
      for (let j = 0; j < this.dataToSelect[i]['type'].length; j++) {
        if (this.dataToSelect[i]['type'][j] == 'timeseries') {
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
      this.displayData = JSON.parse(data.replace(/'/g, "\""))
      for (let j = 0; j < this.displayData.length; j++) {
        let colorline = ''
        j < 10 ? colorline = this.setColor[j] : colorline = this.getRandomColor();
        this.displayData[j]['backgroundColor'] = ['rgba(255,0,0,0)'];
        this.displayData[j]['borderColor'] = [colorline];
        this.displayData[j]['radius'] = 3;
      }
      this.chart.options.title.display = true;
      this.chart.data.labels = this.displayData[0]['data'];
      this.chart.options.title.text = this.data[this.selectedOption - 1].name + ' ' + this.selectedGraphType;
      this.chart.data.datasets = this.displayData.slice(1, this.displayData.length);
      this.chart.update();
    });
  }

  getData2() {
    this.dataService.displayData({ donnee: this.data[this.selectedOption - 1]['name'], type: this.selectedGraphType2 }).subscribe(data => {
      this.listData2 = []
      this.displayData2 = JSON.parse(data.replace(/'/g, "\""))
      for (let j = 0; j < this.displayData2[0]['data'].length; j++) {
        this.listData2.push(j + 1)
      }
      if (!(this.listData2.includes(parseInt(this.idofdata)))) {
        this.idofdata = '1'
      }
      for (let j = 0; j < this.displayData2.length; j++) {
        let colorline = '';
        j < 10 ? colorline = this.setColor[j] : colorline = this.getRandomColor();
        this.displayData2[j]['backgroundColor'] = colorline;
        this.displayData2[j]['borderColor'] = [colorline];
        this.displayData2[j]['radius'] = 230;
        this.displayData2[j]['data'] = [this.displayData2[j]['data'][parseInt(this.idofdata) - 1]];
      }
      this.chart2.options.title.display = true;
      this.chart2.options.title.text = this.data[this.selectedOption - 1].name + ' ' + this.selectedGraphType2;
      this.chart2.data.datasets = this.displayData2;
      this.chart2.update();
    });
  }

  changeValueGraph() {
    if (!!this.chart.chart.getElementAtEvent(event)[0]) {
      let index = this.chart.chart.getElementAtEvent(event)[0]['_index'];
      let number = this.chart.chart.getElementAtEvent(event)[0]['_datasetIndex'];
      var value = prompt("choose new value")
      if (parseFloat(value) >= 0) {
        this.displayData[number + 1]['data'][index] = value;
        this.chart.data.datasets = this.displayData.slice(1, this.displayData.length);
        this.chart.update();
      } else {
        console.log("you need a value");
      }
    }
    else {
      console.log("click on a data");
    }
  }

  createGraph() {
    this.chart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: [6],
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

    this.chart2 = new Chart('myChart2', {
      type: 'bar',
      data: {
        datasets: this.displayData2
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
