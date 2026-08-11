import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  errorMessage = '';

  loginForm;
  constructor(
    private fb: FormBuilder,
    private authServ: Auth,
    private router: Router,
  ) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const result = this.authServ.login(this.loginForm.getRawValue());

    if (!result) {
      this.errorMessage = 'Invalid email or password.';
      return;
    }


    this.errorMessage = '';
    void this.router.navigateByUrl('/donor');
  }
}
