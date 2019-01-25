import { Component, OnInit,Input } from '@angular/core';
import {data} from '../datatest';
import { LearningService } from '../learning.service'

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class LearningComponent implements OnInit {

  constructor(private learningService: LearningService) { }
  data=data;
  table=[0];
  result:boolean=false;
  learning:String;
  @Input() id:number;
  selectedType={};
  selectedLearning:string;
  dataString:any;
  dataTab:any;
  ngOnInit() {
  }

  Result(){
    let dataSent={
      name : data[this.id].name,
      data : JSON.stringify(this.selectedType),
      learning : this.selectedLearning
    }
    this.learningService.learn(dataSent).subscribe(data => {
      this.dataString = data;

      console.log(this.dataString);
    });
    if(!this.result){
    this.result=true;
    this.learning=this.Learn();
    console.log(this.learning)

    }
    else{
      this.result=false;

    }
  }
  addData(){
    this.table.push(this.table.length)
  }
  deleteData(x){
    this.table.pop()
    delete this.selectedType[this.table.length];
  }
  Learn(){
    return "coming soon"
  }
}
