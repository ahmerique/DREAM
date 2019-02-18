import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class LearningService {
  private dataUrl = ' http://localhost:5000/learning';
  private dataUrl2 = ' http://localhost:5000/prediction';
  private dataUrl3 = ' http://localhost:5000/graph';
  private dataUrl4 = ' http://localhost:5000/model'; 
  private dataUrl5 = ' http://localhost:5000/gold'; 
  private dataUrl6 = ' http://localhost:5000/score'; 

  data: any;

  constructor(    private http: HttpClient) { }

  learn(json) {
    // appelle la fonction learning du back pour lancer l'algorithme de traitement des données
    return(this.http.post(this.dataUrl,json, { responseType: 'text' }));
  }

  prediction(json){
    // appelle la fonction prediction du back pour renvoyer des données en cas de perturabtion du modele
    return(this.http.post(this.dataUrl2,json, { responseType: 'text' }));

  }
  createGraph(json){
    return(this.http.post(this.dataUrl3,json, { responseType: 'text' }));
  }
  getRealModel(json){
    return(this.http.post(this.dataUrl4,json, { responseType: 'text' }));
  }
  getGold(json){
    return(this.http.post(this.dataUrl5,json, { responseType: 'text' }));
  }
  getScore(json){
    return(this.http.post(this.dataUrl6,json, { responseType: 'text' }));
  }
}
