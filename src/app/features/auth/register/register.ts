import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  errorMessage = '';
  readonly registerForm;

  constructor(
    private fb: FormBuilder,
    private authServ: Auth,
    private router: Router,
  ) {
    this.registerForm = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const result = this.authServ.register(this.registerForm.getRawValue());

    if (!result) {
      this.errorMessage = 'Registration failed.';
      return;
    }

    this.errorMessage = '';
    void this.router.navigateByUrl('/donor');
  }
}
