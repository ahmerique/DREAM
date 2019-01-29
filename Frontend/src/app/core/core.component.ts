import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Chart } from 'chart.js';
import { runInThisContext } from 'vm';

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
  data = [{id:0,name:'', type:[]}];
  dataTab = [];
  id: number;
  dataString: string = '';
  selectedOption = 1;
  selectedGraphType = 'temporelle';
  chart: Chart;

  data1 = [{ label: 'G1', data: [1, 2, 3] }, { label: 'G2', data: [1, 3, 2] }, { label: 'G3', data: [3, 2, 1] }];
  data2 = [{ label: 'G1', data: [5, 3, 1] }, { label: 'G2', data: [1, 2, 3] }, { label: 'G3', data: [1, 3, 2] }];
  data3 = [{ label: 'G2', data: [5, 3, 1] }, { label: 'G3', data: [1, 10, 3] }, { label: 'G1', data: [1, 3, 2] }];
  dataGraph = [this.data1, this.data2, this.data3,this.data3,this.data3];
  xAxis = [0, 1, 2];


  options = [
    { name: 'option1', value: 1 },
    { name: 'option2', value: 2 }
  ];
  getDataBase(){
    this.dataService.getDataBase().subscribe(data =>
      {
      this.dataString=data,
      this.data=JSON.parse(this.dataString.replace(/'/g,"\"")),
      console.log(this.data)
      
    })
  }
  ngOnInit() {
    this.getDataBase()
    this.chart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: this.xAxis,
        datasets: this.dataGraph[0]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        title: {
          display: true,
          text: this.data[this.selectedOption-1].name + ' ' + this.selectedGraphType
        }
      }
    });
  }

  changeGraphType() {
    this.chart.options.title.text = this.data[this.selectedOption-1].name + ' ' + this.selectedGraphType;
    this.chart.update();
  }

  changeOption() {
    this.chart.options.title.text = this.data[this.selectedOption-1].name + ' ' + this.selectedGraphType;
    this.chart.data.datasets = this.dataGraph[this.selectedOption-1];
    this.chart.update();
  }

  getData() {
    this.dataService.getData().subscribe(response_data => {
      this.dataString = response_data;
      this.dataTab = this.dataString.split('\t');
      console.log(this.dataTab);
    });
  }

  getData2() {
    this.dataService.getData2().subscribe(data => {
      this.dataString = data;
      this.dataTab = this.dataString.split('\t');
      console.log(this.dataTab);
    });
  }




  addFile() {
    !this.addfile ? this.addfile = true : this.addfile = false;
  }

  addGraph() {
    !this.addgraph ? this.addgraph = true : this.addgraph = false;
  }

}
