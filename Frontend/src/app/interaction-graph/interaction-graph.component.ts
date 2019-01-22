import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-interaction-graph',
  templateUrl: './interaction-graph.component.html',
  styleUrls: ['./interaction-graph.component.css']
})
export class InteractionGraphComponent implements OnInit {

  constructor() { }
  model:boolean=false;
  ngOnInit() {
  }
  Modele(){
    if(!this.model){
    this.model=true;
    }
    else{
      this.model=false;

    }
  }
}
