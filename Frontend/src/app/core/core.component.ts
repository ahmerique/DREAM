import { Component, OnInit } from '@angular/core';
import { data } from '../datatest';
import {DataService} from '../data.service'
@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})
export class CoreComponent implements OnInit {
  hauteur = 200;
  selectedDevice: String;
  constructor(private dataService : DataService) { }
  addfile: boolean = false;
  addGraph: boolean = false;
  data = data;
  dataTab=[]
  id: number;
  dataString:String=""
  selectedOption: number = 0
  options = [
    { name: "option1", value: 1 },
    { name: "option2", value: 2 } 
  ];

  ngOnInit() {
  }
  getData(){
    this.dataService.getData().subscribe(data => this.dataString=data)
    if(this.dataString){
      console.log(this.dataString)
    this.dataTab=this.dataString.split('\t')
    console.log(this.dataTab)
    }
  }
  getData2(){
    this.dataString=this.dataService.getData2()
    if(this.dataString){
      console.log(this.dataString)
    this.dataTab=this.dataString.split('\t')
    console.log(this.dataTab)
    }
  }
  Addfile() {
    if (!this.addfile) {
      this.addfile = true;
    }
    else {
      this.addfile = false;

    }
  }
  SuppGraph() {
    this.addGraph = false;
  }
  Addgraph() {
    if (!this.addGraph) {
      this.addGraph = true;
    }
    else {
      this.addGraph = false;

    }
  }

}
