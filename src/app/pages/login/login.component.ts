import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService) { }

  createForm() {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log('Form Data:', formData);
      // Handle login logic here (e.g., call an API)
    } else {
      console.log('Form is invalid');
    }
  }

}
