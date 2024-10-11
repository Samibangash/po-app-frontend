import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.registerForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  onSubmit() {
    this.api.register(this.registerForm.value).subscribe(response => {
      console.log(response);
      // this.router.navigate(['/dashboard']);
    });
  }
}
