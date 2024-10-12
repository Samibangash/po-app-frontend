import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'; // Make sure you have this installed

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserRoleSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);
  public currentUserRole$: Observable<string | null> =
    this.currentUserRoleSubject.asObservable();

  constructor(private jwtHelper: JwtHelperService) {
    // Load initial user role from localStorage if available
    const token = localStorage.getItem('authToken');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const role = this.mapRole(decodedToken.role || decodedToken.roleId);
      this.currentUserRoleSubject.next(role);
    }
  }

  // Method to decode token and get role
  getUserRole(): string | null {
    const token = localStorage.getItem('authToken');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const roleId = decodedToken.role || decodedToken.roleId;
      const role = this.mapRole(roleId);
      this.currentUserRoleSubject.next(role); // Notify components of the updated role
      return role;
    }
    return null;
  }

  // Helper method to map roleId to role name
  private mapRole(roleId: string): string {
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
        return 'Guest';
    }
  }

  // Call this on login to update role and notify subscribers
  setUserRoleFromToken(token: string): void {
    localStorage.setItem('authToken', token);
    const decodedToken = this.jwtHelper.decodeToken(token);
    const role = this.mapRole(decodedToken.role || decodedToken.roleId);
    this.currentUserRoleSubject.next(role); // Update currentUserRoleSubject
  }

  // Logout function
  logout(): void {
    localStorage.removeItem('authToken');
    this.currentUserRoleSubject.next(null); // Reset role to null
  }

  getCurrentUserId(): number | null {
    const token = localStorage.getItem('authToken'); // Retrieve the token
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log('Decoded Token:', decodedToken); // Log the entire token to check the structure

      // Check if 'id' exists and is a valid number
      const userId = decodedToken?.id || null;

      if (userId !== null && typeof userId === 'number') {
        console.log('User ID:', userId);
        return userId;
      } else {
        console.error('User ID is not valid or not found in the token');
        return null;
      }
    }
    return null; // Return null if no valid token
  }

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
}
