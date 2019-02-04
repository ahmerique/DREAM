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
  private dataUrl = ' http://localhost:5000/wildtype';
  private dataUrl3 = ' http://localhost:5000/addFile';
  private dataUrl4='http://localhost:5000/data';
  private dataUrl5='http://localhost:5000/displayData'
  private dataUrl6='http://localhost:5000/displayTimeseries'


  data: any;

  constructor(    private http: HttpClient) { }
  getData() {
    // fonction test pour renvoyer des données depuis la base de données
    console.log("getdata")
    return (this.http.get(this.dataUrl, { responseType: 'text' }));
  }


  sendData(file){

    return (this.http.post(this.dataUrl3, file,{ responseType: 'text' }));

  }
  getDataBase(){
    return (this.http.get(this.dataUrl4, { responseType: 'text' }));
  }
  displayData(data){
    console.log(data)
    if(data['type']!="timeseries"){
    return (this.http.post(this.dataUrl5,data, { responseType: 'text' }));
    }
    else{
    return (this.http.post(this.dataUrl6,data, { responseType: 'text' }))
    }

  }
}
