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
  data = [{id:0,name:'', type:[]}];
  dataTab = [];
  id: number;
  dataString: string = '';
  selectedOption = 1;
  selectedGraphType = 'temporelle';
  chart: Chart;
  displayData=[]
  lengthData=10
  data1 = [{ label: 'G1', data: [1, 2, 3] }, { label: 'G2', data: [1, 3, 2] }, { label: 'G3', data: [3, 2, 1] }];
  data2 = [{ label: 'G1', data: [5, 3, 1] }, { label: 'G2', data: [1, 2, 3] }, { label: 'G3', data: [1, 3, 2] }];
  data3 = [{ label: 'G2', data: [5, 3, 1] }, { label: 'G3', data: [1, 10, 3] }, { label: 'G1', data: [1, 3, 2] }];
  dataGraph = [this.data1, this.data2, this.data3,this.data3,this.data3];
  xAxis = [0, 1, 2,3,4,5,6,7,8,9];


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

  getData() {
    this.dataService.displayData().subscribe(data => {
      this.dataString=data,
      this.displayData=JSON.parse(this.dataString.replace(/'/g,"\""))
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
          },
          title: {
            display: true,
            text: this.data[this.selectedOption-1].name + ' ' + this.selectedGraphType
          }
        }
      });
    });
  }

  ngOnInit() {
    this.getDataBase()
    this.getData()
    
    
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


  addFile() {
    !this.addfile ? this.addfile = true : this.addfile = false;
  }

  addGraph() {
    !this.addgraph ? this.addgraph = true : this.addgraph = false;
  }

}
