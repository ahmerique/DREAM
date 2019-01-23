import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.css']
})
export class CompteComponent implements OnInit {

  _pseudo = 'Bioman';
  _mail = 'Bioman@coucou.io';
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

  newInfo(newPseudo: string, newMail: string): void {

  }
}
