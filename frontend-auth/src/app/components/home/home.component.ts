import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.getCurrentUser();
  }

  getCurrentUser() {
    const userEmail = this.authService.getEmail();
    const userRole = this.authService.getRole();
    if (userEmail && userRole) {
      this.currentUser = {
        id: 0,
        firstName: '',
        lastName: '',
        email: userEmail,
        role: userRole as 'ADMIN' | 'USER'
      };
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
