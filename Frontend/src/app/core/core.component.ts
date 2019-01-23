import { Component, OnInit } from '@angular/core';

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
  Addgraph() {
    if (!this.addGraph) {
      this.addGraph = true;
    }
    else {
      this.addGraph = false;

    }
  }
  test(arg) {
    console.log(arg);
  }
}
