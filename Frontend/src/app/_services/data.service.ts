import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../env';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataUrl = API_URL + '/wildtype';
  private dataUrl3 = API_URL + '/addFile';
  private dataUrl4 = API_URL + '/data';
  private dataUrl5 = API_URL + '/displayData';
  private dataUrl6 = API_URL + '/displayTimeseries';


  data: any;

  constructor(private http: HttpClient) { }
  getData(json) {
    // fonction test pour renvoyer des données depuis la base de données
    console.log("getdata")
    return (this.http.post(this.dataUrl, json, { responseType: 'text' }));
  }


  sendData(file) {

    return (this.http.post(this.dataUrl3, file, { responseType: 'text' }));

  }

  getDataBase() {
    return (this.http.get(this.dataUrl4, { responseType: 'text' }));
  }

  displayData(data) {
    console.log(data)
    if (data['type'] != "timeseries") {
      return (this.http.post(this.dataUrl5, data, { responseType: 'text' }));
    }
    else {
      return (this.http.post(this.dataUrl6, data, { responseType: 'text' }))
    }

  }
}
