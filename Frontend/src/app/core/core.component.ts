import { Component, OnInit } from '@angular/core';
import { data } from '../datatest';
@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})
export class CoreComponent implements OnInit {
  hauteur = 200;
  selectedDevice: String;
  constructor() { }
  addfile: boolean = false;
  addGraph: boolean = false;
  data = data;
  id: number;
  selectedOption: number = 0
  options = [
    { name: "option1", value: 1 },
    { name: "option2", value: 2 }
  ];

  ngOnInit() {
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
