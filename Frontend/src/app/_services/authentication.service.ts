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
    return this.http.post<any>(API_URL + '/auth/checkpassword', { 'password': password }); { }
  }

  deleteAccount(password: string) {
    return this.http.post<any>(API_URL + '/auth/deleteaccount', { 'password': password })
      .pipe(map(log => {
        localStorage.removeItem('currentUser');
        return log;
      }));
  }

  checkToken() {
    return this.http.get<any>(API_URL + '/auth/checktoken').pipe(
      map((res) => {
        if (res.status === 'success') { return true; }
        return false;
      }));
  }

  getUser() {
    return this.http.get<any>(API_URL + '/auth/status');
  }

  getHistory() {
    return;
  }
}
