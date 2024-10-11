import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  onSubmit() {
    this.api.login(this.loginForm.value).subscribe((response:any) => {
      if(response.success){
        localStorage.setItem("token",response.data.jwt);
        localStorage.setItem("user",response.data.z);

        this.router.navigate(['/dashboard']);
      }else{
        alert("Something went wrong")
      }
      console.log(response);
    });
  }

}
