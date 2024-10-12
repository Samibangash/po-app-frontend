import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Define the User interface
interface User {
  id: number;
  username: string;
  role: string;
  role_name: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/auth/users';

  constructor(private http: HttpClient) {}

  // Fetch users by role
  getUsersByRole(roleId: number): Observable<User[]> {
    return this.http.get<any>(`${this.apiUrl}?role=${roleId}`).pipe(
      map((response) => {
        if (response && Array.isArray(response.data)) {
          return response.data;
        } else {
          return [];
        }
      })
    );
  }
}
