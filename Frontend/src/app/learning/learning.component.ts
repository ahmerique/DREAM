import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class LearningComponent implements OnInit {

  constructor() { }
  result:boolean=false;
  ngOnInit() {
  }
  Result(){
    if(!this.result){
    this.result=true;
    }
    else{
      this.result=false;

    }
  }
}
