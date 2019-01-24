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

  data: any

  constructor(
    private http: HttpClient) {}
    getData() {

      return(this.http.get(this.dataUrl,{responseType: 'text'}))
    }
    getData2() {
      this.http.get(this.dataUrl2,{responseType: 'text'}).subscribe(data => this.data = data)
      console.log(this.data)
      return(this.data)
    }
  }
