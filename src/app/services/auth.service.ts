import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt'; // Make sure @auth0/angular-jwt is installed
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  getUserRole(): string {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token is missing in localStorage.');
    }

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);

      // Assuming 'role' or 'roleId' is the correct key in the decoded token:
      const roleId = decodedToken.role || decodedToken.roleId;
      console.log('Decoded Token:', decodedToken);
      console.log('Role ID:', roleId);

      // Map the roleId to role name
      switch (roleId) {
        case '1':
          return 'Admin';
        case '2':
          return 'Team Lead';
        case '3':
          return 'Department Manager';
        case '4':
          return 'Finance Manager';
        case '5':
          return 'User';
        default:
          return 'Guest'; // If no valid role is found, default to 'Guest'
      }
    }
    return 'Guest'; // Return 'Guest' if no valid token is found
  }

  // Method to get the current user details from token
  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return of({
        userId: decodedToken.userId,
        roleId: decodedToken.roleId, // Assuming roleId is part of the token
      });
    }
    return of(null); // Return null if no valid token
  }

  // Fetch users based on role IDs
  // getUsersByRoles(roleIds: number[]): Observable<any> {
  //   console.log('ppppppppp', roleIds);

  //   return this.http.post('http://localhost:8080/api/auth/users', { roleIds });
  // }
}
