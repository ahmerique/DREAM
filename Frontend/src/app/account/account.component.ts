import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  _pseudo = '';
  _email = '';
  _changePassword = false;
  _changeInfo = false;
  _previousClick = '';
  _deleteAccount = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.authenticationService.getUser()
      .pipe(first())
      .subscribe(
        res => {
          this._pseudo = res.data.pseudo;
          this._email = res.data.email;
        },
        error => {
          console.log(error);
        });
  }

  onClick(term): void {
    if (term === this._previousClick) {
      this._changePassword = false;
      this._changeInfo = false;
      this._deleteAccount = false;
      this._previousClick = '';
    } else if (term === 'password') {
      this._changePassword = true;
      this._changeInfo = false;
      this._deleteAccount = false;
      this._previousClick = 'password';
    } else if (term === 'info') {
      this._changePassword = false;
      this._changeInfo = true;
      this._deleteAccount = false;
      this._previousClick = 'info';
    } else if (term === 'deleteAccount') {
      this._changePassword = false;
      this._changeInfo = false;
      this._deleteAccount = true;
      this._previousClick = 'deleteAccount';
    }
  }


  changePassword(oldPassword: string, newPassword: string, confirmPassword: string): void {
    this.authenticationService.changeAccountPassword(oldPassword, newPassword)
      .pipe(first())
      .subscribe(
        data => {
          console.log('Password changed');
          this.router.navigate(['/account']);
        },
        error => {
          console.log(error);
        }
      );

  }

  changeInfo(newPseudo: string, newEmail: string, password: string): void {
    this.authenticationService.changeAccountInfo(newPseudo, newEmail, password)
      .pipe(first())
      .subscribe(
        data => {
          console.log('account info changed');
          this.router.navigate(['/account']);
        },
        error => {
          console.log(error);
        }
      );

  }

  deleteAccount(password: string) {
    this.authenticationService.deleteAccount(password)
      .pipe(first())
      .subscribe(
        data => {
          console.log('account deleted');
          this.router.navigate(['/login']);
        },
        error => {
          console.log(error);
        }
      );
  }
}
