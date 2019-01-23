import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class LearningComponent implements OnInit {

  constructor() { }
  result:boolean=false;
  learning:String;
  ngOnInit() {
  }
  Result(){

    if(!this.result){
    this.result=true;
    this.learning=this.Learn();
    console.log(this.learning)
    }
    else{
      this.result=false;

    }
  }
  Learn(){
    return "coming soon"
  }
}
