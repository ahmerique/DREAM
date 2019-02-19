import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { API_URL } from './env';

@Injectable({
  providedIn: 'root'
})
export class LearningService {
  private dataUrl = API_URL + '/learning';
  private dataUrl2 = API_URL + '/prediction';
  private dataUrl3 = API_URL + '/graph';
  private dataUrl4 = API_URL + '/model';
  private dataUrl5 = API_URL + '/gold';
  private dataUrl6 = API_URL + '/score';

  data: any;

  constructor(private http: HttpClient) { }

  learn(json) {
    // appelle la fonction learning du back pour lancer l'algorithme de traitement des données
    return (this.http.post(this.dataUrl, json, { responseType: 'text' }));
  }

  prediction(json) {
    // appelle la fonction prediction du back pour renvoyer des données en cas de perturabtion du modele
    return (this.http.post(this.dataUrl2, json, { responseType: 'text' }));

  }
  createGraph(json) {
    return (this.http.post(this.dataUrl3, json, { responseType: 'text' }));
  }
  getRealModel(json) {
    return (this.http.post(this.dataUrl4, json, { responseType: 'text' }));
  }
  getGold(json) {
    return (this.http.post(this.dataUrl5, json, { responseType: 'text' }));
  }
  getScore(json) {
    return (this.http.post(this.dataUrl6, json, { responseType: 'text' }));
  }
}
