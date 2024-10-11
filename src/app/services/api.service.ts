import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router'; // Import Router

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private router: Router) {} // Inject Router

  baseURL = 'http://localhost:8080/api/';

  // Function to get HttpOptions with Authorization header
  private getHttpOptions() {
    const token = localStorage.getItem('authToken'); // Get token from localStorage
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Add Authorization header if token exists
    // if (token) {
    //   headers = headers.set('Authorization', `Bearer ${token}`);
    // }

    return { headers };
  }

  // Login method (no Authorization header needed for login)
  login(data: any) {
    return this.http.post(this.baseURL + 'auth/login', data).pipe(
      tap((response: any) => {
        if (response.success) {
          localStorage.setItem('authToken', response.data.jwt);
          // Save token after successful login
          console.log('-------->', response);
          // Redirect based on the user's role
          if (response.data.user.role == 1) {
            this.router.navigate(['/admin-layout']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }
      }),
      catchError((error) => {
        console.error('Login API error:', error);
        return throwError(error);
      })
    );
  }

  // Register method with Authorization header
  register(data: any) {
    return this.http
      .post(this.baseURL + 'auth/register', data, this.getHttpOptions()) // Send request with token (if available)
      .pipe(
        catchError((error) => {
          console.error('Register API error:', error);
          return throwError(error);
        })
      );
  }

  // Method to create a Purchase Order (PO)
  createPo(data: any) {
    return this.http
      .post(this.baseURL + 'po/create', data, this.getHttpOptions()) // Token required
      .pipe(
        catchError((error) => {
          console.error('Create PO API error:', error);
          return throwError(error);
        })
      );
  }

  // Method to fetch all Purchase Orders (POs)
  getPurchaseOrders() {
    return this.http
      .get(this.baseURL + 'po', this.getHttpOptions()) // Token required
      .pipe(
        catchError((error) => {
          console.error('PO API error:', error);
          return throwError(error);
        })
      );
  }

  // Example method to access a protected resource
  getProtectedResource() {
    return this.http
      .get(this.baseURL + 'protected/resource', this.getHttpOptions()) // Authenticated requests need token
      .pipe(
        catchError((error) => {
          console.error('Protected API error:', error);
          return throwError(error);
        })
      );
  }

  // Method to generate PDF for a given PO number
  generatePdf(id: string): Observable<HttpResponse<Blob>> {
    const url = `${this.baseURL}po/generate-pdf/${id}`;
    return this.http
      .get(url, {
        headers: this.getHttpOptions().headers,
        responseType: 'blob',
        observe: 'response',
      }) // Ensure token is sent
      .pipe(
        catchError((error) => {
          console.error('Error generating PDF:', error);
          return throwError(error);
        })
      );
  }
  // Get purchase orders

  // Approve purchase order
  approvePurchaseOrder(poNumber: string): Observable<any> {
    console.log(poNumber);

    return this.http.put(this.baseURL + `workflow/${poNumber}/approve`, {});
  }

  // Reject purchase order
  rejectPurchaseOrder(poNumber: string): Observable<any> {
    return this.http.post(`/api/purchase-orders/${poNumber}/reject`, {});
  }

  // Get approval workflow for a specific purchase order
  getApprovalWorkflow(poId: number): Observable<any> {
    return this.http.get(this.baseURL + `po/${poId}`, this.getHttpOptions());
  }

  createApprovalWorkflow(apiUrl: string): Observable<any> {
    return this.http.post(apiUrl, {});
  }
}
