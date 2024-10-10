import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  baseURL = "http://localhost:8080/";
  login(data: any) {
    return this.http.post(this.baseURL + "auth/login", data)
  }

  register(data: any) {
    return this.http.post(this.baseURL + "auth/login", data)
  }

}
