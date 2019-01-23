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

  result:boolean=false;
  learning:String;
  @Input() id:number;
  selectedType1:string;
  selectedType2:string;
  selectedLearning:string;
  ngOnInit() {
  }
  Result(){
    console.log("Fichier :" + data[this.id].name + "\nDonnées : " + this.selectedType1+" , "+this.selectedType2 +'\nMéthode d\'apprentissage : ' + this.selectedLearning )
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
