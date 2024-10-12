import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  errorMessage: string = ''; // To hold the error message

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group({
      username: [''],
      password: [''],
      role: ['5'], // Default to "User" role
      role_name: ['User'], // Default to "User" role name
    });
  }

  onSubmit() {
    // Set the role_name based on the selected role
    const selectedRole = this.registerForm.get('role')?.value;
    let roleName = '';

    switch (selectedRole) {
      case '2':
        roleName = 'Team Lead';
        break;
      case '3':
        roleName = 'Department Manager';
        break;
      case '4':
        roleName = 'Finance Manager';
        break;
      case '5':
        roleName = 'User';
        break;
    }

    this.registerForm.patchValue({ role_name: roleName });

    // Make the API call to register the user
    this.api.register(this.registerForm.value).subscribe(
      (response) => {
        if (response.success) {
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      },
      (error) => {
        // If there is an error, such as username already taken
        if (error.errorType === 'UsernameAlreadyTakenError') {
          this.errorMessage =
            'Username is already taken. Please choose another one.';
        } else {
          this.errorMessage =
            'Username is already taken. Please choose another one.';
        }
      }
    );
  }
}
