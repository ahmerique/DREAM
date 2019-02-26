import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from '../_services/index';

import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  forgot_password = false;
  lang: string;
  subscriptionLanguage: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private messageService: MessageService
  ) {
    this.subscriptionLanguage = this.messageService.getMessage().subscribe(message => {
      if (message.text === 'changeLanguage') {
        this.lang = localStorage.getItem('language') ? localStorage.getItem('language') : 'fr';
      }
    });
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      pseudo: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.lang = localStorage.getItem('language') ? localStorage.getItem('language') : 'fr';

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }


  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.pseudo.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.messageService.sendMessage('login');
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  forgotPassword(email): void {
    this.authenticationService.forgotPassword(email)
      .pipe(first())
      .subscribe(
        data => {
          alert('An email has been sent to reset your password');
        },
        error => {
          this.error = error;
          this.loading = false;
        });

  }

}
