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
export class DataService {
  private dataUrl = ' http://localhost:5000/test';
  private dataUrl2 = ' http://localhost:5000/test2';

  data: any;

  constructor(    private http: HttpClient) { }
  getData() {
    // fonction test pour renvoyer des données depuis la base de données
    return (this.http.get(this.dataUrl, { responseType: 'text' }));
  }

  getData2() {
    // fonction test pour renvoyer des données depuis la base de données

    return (this.http.get(this.dataUrl2, { responseType: 'text' }));

  }
}
