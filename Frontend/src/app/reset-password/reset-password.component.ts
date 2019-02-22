import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from '../_helpers/password.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },
      {
        validator: ConfirmPasswordValidator.validate.bind(this)
      });
  }

  // convenience getter for easy access to form fields
  get form() { return this.resetForm.controls; }

  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }

    this.loading = true;

    this.authenticationService.resetPassword(this.route.snapshot.paramMap.get('token'), this.form.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          alert('Password changed');
          this.router.navigate(['/login']);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

}
