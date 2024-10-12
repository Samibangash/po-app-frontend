import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Add Validators
      password: ['', Validators.required], // Add Validators
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage = null;

    this.api.login(this.loginForm.value).subscribe(
      (response: any) => {
        if (response.success) {
          const token = response.data.jwt;

          // Store the token in localStorage
          localStorage.setItem('authToken', token);

          // Notify AuthService of the new role
          this.authService.setUserRoleFromToken(token);

          // Redirect based on the user's role
          const userRole = response.data.user.role;
          if (userRole == 1) {
            this.router.navigate(['/admin-layout']);
          } else if (userRole == 5) {
            this.router.navigate(['/user-layout']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.errorMessage = 'Invalid username or password';
        }
      },
      (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Incorrect username or password';
        } else {
          this.errorMessage =
            'An unexpected error occurred. Please try again later.';
        }
      }
    );
  }
}
