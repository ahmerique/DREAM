import { Component, OnInit } from '@angular/core';
import { data } from '../datatest';
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
  data = data;
  dataTab = [];
  id: number;
  dataString: String = '';
  selectedOption = 0;
  selectedGraphType = 'temporelle';
  chart: Chart;

  options = [
    { name: 'option1', value: 1 },
    { name: 'option2', value: 2 }
  ];

  ngOnInit() {
    this.chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: this.selectedGraphType,
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
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
          text: this.data[this.selectedOption].name
        }
      }
    });
  }

  changeGraphType() {
    this.chart.data.datasets[0].label = this.selectedGraphType;
    this.chart.update();
  }

  changeOption() {
    this.chart.options.title.text = this.data[this.selectedOption].name;
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
