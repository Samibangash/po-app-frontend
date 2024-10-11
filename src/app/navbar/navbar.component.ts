import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Assuming AuthService is in the services folder
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  currentUserRole: string | null = ''; // Variable to store the current user's role

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Use AuthService to get the role, or alternatively fetch it from localStorage
    this.currentUserRole =
      this.authService.getUserRole() || localStorage.getItem('currentUserRole');
  }

  logout() {
    localStorage.removeItem('authToken'); // Remove the JWT token from local storage
    localStorage.removeItem('currentUserRole'); // Remove current user role if stored
    this.router.navigate(['/login']); // Redirect to login page or any other page after logout
  }
}
