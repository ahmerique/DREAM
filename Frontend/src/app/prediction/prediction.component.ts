import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnInit {
  Gname=[{name:"G1",value:0.42},{name:"G2",value:0.42},{name:"G3",value:0.42},{name:"G4",value:0.42},{name:"G5",value:0.42},{name:"G6",value:0.42},{name:"G7",value:0.42},{name:"G8",value:0.42},{name:"G9",value:0.42},{name:"G10",value:0.42}]
  constructor() { }
  show: boolean = false;
  Show(){
    if(!this.show){
    this.show=true;
    }
    else{
      this.show=false;

    }
  }
  ngOnInit() {
  }

}
