import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Import AuthService
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  currentUserRole: string | null = ''; // Store user role
  private roleSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to the role observable to dynamically update the role in navbar
    this.roleSubscription = this.authService.currentUserRole$.subscribe(
      (role) => {
        this.currentUserRole = role;
      }
    );
  }

  // Clean up the subscription to avoid memory leaks
  ngOnDestroy(): void {
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout(); // Use AuthService to logout
    this.router.navigate(['/login']); // Redirect to login
  }
}
