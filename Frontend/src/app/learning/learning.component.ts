import { Component, OnInit,Input } from '@angular/core';
import {data} from '../datatest';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class LearningComponent implements OnInit {

  constructor() { }
  data=data;
  table=[0];
  result:boolean=false;
  learning:String;
  @Input() id:number;
  selectedType={};
  selectedLearning:string;
  ngOnInit() {
  }
  Result(){
    console.log("Fichier :" + data[this.id].name + "\nDonnées : " +JSON.stringify(this.selectedType)+'\nMéthode d\'apprentissage : ' + this.selectedLearning )
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
