import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class LearningService {
  private dataUrl = ' http://localhost:5000/learning';

  data: any;

  constructor(
    private http: HttpClient) { }
  learn(json) {
    return (this.http.post(this.dataUrl,json, { responseType: 'text' }));
  }

}
