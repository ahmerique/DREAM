import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  _pseudo = 'Bioman';
  _email = 'Bioman@coucou.io';
  _changePassword = false;
  _changeInfo = false;

  constructor() { }

  ngOnInit() {
  }

  onClick(term): void {
    if (term === 'password') {
      this._changePassword = true;
      this._changeInfo = false;
    } else if (term === 'info') {
      this._changePassword = false;
      this._changeInfo = true;
    }
  }

  newPassword(oldPassword: string, newPassword: string, confirmPassword: string): void {

  }

  newInfo(newPseudo: string, newemail: string): void {

  }
}
