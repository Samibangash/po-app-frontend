import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.loginForm = this.fb.group({
      username: [''],
      password: [''],
    });
  }

  onSubmit() {
    this.api.login(this.loginForm.value).subscribe((response: any) => {
      if (response.success) {
        // Store the JWT token and user data in local storage
        localStorage.setItem('authToken', response.data.jwt);
        localStorage.setItem('user', response.data.z);

        // Redirect based on the user's role
        if (response.data.user.role == 1) {
          this.router.navigate(['/admin-layout']);
        } else if (response.data.user.role == 5) {
          this.router.navigate(['/user-layout']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      } else {
        alert('Something went wrong');
      }

      // Log the response for debugging purposes
      console.log(response);
    });
  }
}
