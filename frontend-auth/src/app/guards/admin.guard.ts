import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('AdminGuard: Checking access...');
    
    if (!this.authService.isLoggedIn()) {
      console.log('AdminGuard: User not logged in');
      this.router.navigate(['/login']);
      return false;
    }

    const isAdmin = this.authService.isAdmin();
    console.log('AdminGuard: Is user admin?', isAdmin);

    if (!isAdmin) {
      console.log('AdminGuard: Access denied - User is not admin');
      this.router.navigate(['/']);
      return false;
    }

    console.log('AdminGuard: Access granted - User is admin');
    return true;
  }
} 