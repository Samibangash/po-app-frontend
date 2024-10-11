import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  baseURL = 'http://localhost:8080/api/';

  // Create a common method to add headers
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }

  // Login method with headers
  login(data: any) {
    return this.http
      .post(this.baseURL + 'auth/login', data, this.getHttpOptions())
      .pipe(
        catchError((error) => {
          console.error('Login API error:', error);
          return throwError(error);
        })
      );
  }

  // Register method with headers
  register(data: any) {
    return this.http
      .post(this.baseURL + 'auth/register', data, this.getHttpOptions())
      .pipe(
        catchError((error) => {
          console.error('Register API error:', error);
          return throwError(error);
        })
      );
  }
}
