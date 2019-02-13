import { Component, OnInit, Input, Output } from '@angular/core';
import { DataService } from '../data.service';
import { Chart } from 'chart.js';
// import { ConsoleReporter } from 'jasmine';

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
  dataToSelect = [{ id: 0, name: '', type: [] }]; // egal a data, sans les timeseries (pour le second affichage)
  dataTab = [];
  id: number;
  idofdata = '1';
  selectedOption = 1;
  selectedGraphType = 'timeseries';
  selectedGraphType2 = 'knockdowns';
  chart: Chart;
  chart2: Chart;
  displayData = [];
  displayData2 = [];
  listData2 = [];
  setColor2 = ['Aqua', 'Blue', 'Fuchsia', 'Green', 'Lime', 'Navy', 'Olive', 'Purple', 'Teal', 'Yellow'];
  setColor = ['#FF0000', '#A02831', '#C24040', '#F6745A', '#FDD784', '#FF5900', '#FF9300', 'black', 'blue', 'green', 'purple'];
  lengthData = 10;
  flagG=true

  getDataBase() {
    this.dataService.getDataBase().subscribe(data => {
      this.data = JSON.parse(data.replace(/'/g, '"'));
      this.dataToSelect = this.data;
      this.getData();
      this.getData2();
      this.updateSelectData();
    });
  }

  updateSelectData() {
    for (let i = 0; i < this.dataToSelect.length; i++) {
      for (let j = 0; j < this.dataToSelect[i]['type'].length; j++) {
        if (this.dataToSelect[i]['type'][j] === 'timeseries') {
          this.dataToSelect[i]['type'].splice(j, 1);
        }
      }
    }
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getData() {
    this.dataService.displayData({ donnee: this.data[this.selectedOption - 1]['name'], type: this.selectedGraphType }).subscribe(data => {
      this.displayData = JSON.parse(data.replace(/'/g, '"'));
      for (let j = 0; j < this.displayData.length; j++) {
        let colorline = '';
        j <= 10 ? colorline = this.setColor[j] : colorline = this.getRandomColor();
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
      this.listData2 = [];
      this.displayData2 = JSON.parse(data.replace(/'/g, '"'));
      console.log(this.displayData2);
      for (let j = 0; j < this.displayData2[0]['data'].length; j++) {
        this.listData2.push(j + 1);
      }
      console.log(this.listData2);
      if (!(!(parseInt(this.idofdata)))){
        this.idofdata='G'+(this.idofdata)
      }
      if (!(this.listData2.includes(parseInt(this.idofdata.substr(1))))) {
        this.idofdata = 'G1';
      }

      (this.selectedGraphType2 == 'wildtype' || this.selectedGraphType2 == 'multifactorial')?this.flagG=false : this.flagG=true

      console.log(this.idofdata);
      if (this.selectedGraphType2 !== 'knockouts') {
        for (let j = 0; j < this.displayData2.length; j++) {
          let colorline = '';
          j < 10 ? colorline = this.setColor[j] : colorline = this.getRandomColor();
          this.displayData2[j]['backgroundColor'] = colorline;
          this.displayData2[j]['borderColor'] = [colorline];
          this.displayData2[j]['radius'] = 230;
          this.displayData2[j]['data'] = [this.displayData2[j]['data'][parseInt(this.idofdata.substr(1)) - 1]];
          this.displayData2[j]['label'] = 'G' + (j + 1).toString();
        }
        this.chart2.options.title.display = true;
        this.chart2.options.title.text = this.data[this.selectedOption - 1].name + ' ' + this.selectedGraphType2;
        this.chart2.data.datasets = this.displayData2;
        this.chart2.update();
      } else {
        for (let j = 0; j < this.displayData2.length; j++) {
          let colorline = '';
          if (j % 2 === 0) {
            (j / 2) < 10 ? colorline = this.setColor[j / 2] : colorline = this.getRandomColor();
            this.displayData2[j]['backgroundColor'] = colorline;
            this.displayData2[j]['borderColor'] = [colorline];
            this.displayData2[j]['radius'] = 230;
            this.displayData2[j]['data'] = [this.displayData2[j]['data'][parseInt(this.idofdata.substr(1)) - 1]];
            this.displayData2[j]['label'] = 'G' + (j / 2 + 1).toString();
          } else {
            colorline = '#ddd';
            this.displayData2[j]['backgroundColor'] = colorline;
            this.displayData2[j]['borderColor'] = [colorline];
            this.displayData2[j]['radius'] = 230;
            this.displayData2[j]['data'] = [this.displayData2[j]['data'][0]];
            this.displayData2[j]['label'] = 'G' + ((j - 1) / 2 + 1).toString() + ' (Wild)';
          }
        }
        this.chart2.options.title.display = true;
        this.chart2.options.title.text = this.data[this.selectedOption - 1].name + ' ' + this.selectedGraphType2;
        this.chart2.data.datasets = this.displayData2;
        this.chart2.update();
        if (!this.flagG){
          this.idofdata=(this.idofdata).substr(1)
        }
      }
    });
  }

  changeValueGraph() {
    if (!!this.chart.chart.getElementAtEvent(event)[0]) {
      const index = this.chart.chart.getElementAtEvent(event)[0]['_index'];
      const number = this.chart.chart.getElementAtEvent(event)[0]['_datasetIndex'];
      const value = prompt('choose new value');
      if (parseFloat(value) >= 0) {
        this.displayData[number + 1]['data'][index] = value;
        this.chart.data.datasets = this.displayData.slice(1, this.displayData.length);
        this.chart.update();
      } else {
        console.log('you need a value');
      }
    } else {
      console.log('click on a data');
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
    this.getDataBase();
    this.createGraph();
  }

  addFile() {
    !this.addfile ? this.addfile = true : this.addfile = false;
  }

  addGraph() {
    !this.addgraph ? this.addgraph = true : this.addgraph = false;

  }
  straightLine() {
    for (let j = 0; j < this.displayData.length; j++) {
      this.displayData[j]['showLine'] = true;
    }
    this.chart.options.elements.line.tension = 0.01
    this.chart.update();  
  }


  curveLine() {
    for (let j = 0; j < this.displayData.length; j++) {
      this.displayData[j]['showLine'] = true;
    }
    this.chart.options.elements.line.tension = 0.44;
    this.chart.update();

  }
  dots() {
    for (let j = 0; j < this.displayData.length; j++) {
      this.displayData[j]['showLine'] = false;
    }
    this.chart.update();

  }
}
