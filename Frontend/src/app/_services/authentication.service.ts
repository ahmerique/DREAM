import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { API_URL } from '../env';

@Injectable({ providedIn: 'root' })

export class AuthenticationService {


  constructor(
    private http: HttpClient,
  ) { }

  login(pseudo: string, password: string) {
    return this.http.post<any>(API_URL + '/auth/login', { 'pseudo': pseudo, 'password': password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.auth_token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        return user;
      }));
  }

  register(pseudo: string, email: string, password: string) {
    return this.http.post<any>(API_URL + '/auth/register', { 'pseudo': pseudo, 'email': email, 'password': password }); { }
  }

  logout() {
    // black list token and delete current user to log user out
    return this.http.post<any>(API_URL + '/auth/logout', {})
      .pipe(map(log => {
        localStorage.removeItem('currentUser');
        return log;
      }));
  }

  checkPassword(password: string) {
    return this.http.post<any>(API_URL + '/auth/checkpassword', { 'password': password });
  }

  deleteAccount(password: string) {
    return this.http.post<any>(API_URL + '/auth/deleteaccount', { 'password': password })
      .pipe(map(log => {
        localStorage.removeItem('currentUser');
        return log;
      }));
  }

  checkToken() {
    return this.http.get<any>(API_URL + '/auth/checktoken');
  }

  getUser() {
    return this.http.get<any>(API_URL + '/auth/status');
  }

  addQueryHistory() {
    return this.http.post<any>(API_URL + '/auth/addsearchquery', { 'tsv': 'coucou', 'model': 'coucou2', 'results': 'coucou3' });
  }

  getQueryHistory() {
    return this.http.get<any>(API_URL + '/auth/searchquery');
  }

  postQueryHistory(query_id) {
    return this.http.post<any>(API_URL + '/auth/searchquery', { 'query_id': query_id });
  }

  deleteQueryHistory(query_id) {
    return this.http.post<any>(API_URL + '/auth/deletesearchquery', { 'query_id': query_id });
  }

  changeAccountInfo(new_pseudo, new_email, password) {
    return this.http.post<any>(API_URL + '/account/changeinfo', { 'new_pseudo': new_pseudo, 'new_email': new_email, 'password': password });
  }

  changeAccountPassword(password, new_password) {
    return this.http.post<any>(API_URL + '/account/changepassword', { 'new_password': new_password, 'password': password });
  }

}
