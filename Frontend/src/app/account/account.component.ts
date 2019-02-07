import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from '../_helpers/password.validator';


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

  changePasswordForm: FormGroup;
  changeInfoForm: FormGroup;
  deleteForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder,
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

    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
      {
        validator: ConfirmPasswordValidator.validate.bind(this)
      });

    this.changeInfoForm = this.formBuilder.group({
      pseudo: [''],
      email: [''],
      password: ['', Validators.required],
    });

    this.deleteForm = this.formBuilder.group({
      password: ['', Validators.required]
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


  // convenience getter for easy access to form fields
  get fPassword() { return this.changePasswordForm.controls; }

  changePassword() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.changePasswordForm.invalid) {
      return;
    }

    this.loading = true;

    this.authenticationService.changeAccountPassword(this.fPassword.oldPassword.value, this.fPassword.password.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log('Password changed');
          this.loading = false;
          this.router.navigate(['/account']);
        },
        error => {
          this.error = error;
          this.loading = false;
        }
      );
  }

  // convenience getter for easy access to form fields
  get fInfo() { return this.changeInfoForm.controls; }

  changeInfo(): void {

    this.submitted = true;

    // stop here if form is invalid
    if (this.changeInfoForm.invalid) {
      return;
    }

    this.loading = true;

    this.authenticationService.changeAccountInfo(this.fInfo.pseudo.value, this.fInfo.email.value, this.fInfo.password.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log('account info changed');
          this.loading = false;
          this.router.navigate(['/account']);
        },
        error => {
          this.error = error;
          this.loading = false;
        }
      );

  }

  deleteAccount() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.changeInfoForm.invalid) {
      return;
    }

    this.loading = true;

    this.authenticationService.deleteAccount(this.deleteForm.controls.password.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log('account deleted');
          this.router.navigate(['/login']);
        },
        error => {
          this.error = error;
          this.loading = false;
        }
      );
  }
}
