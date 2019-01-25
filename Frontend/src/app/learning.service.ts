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

  data: any;

  constructor(    private http: HttpClient) { }

  learn(json) {
    return(this.http.post(this.dataUrl,json, { responseType: 'text' }));
  }

}
