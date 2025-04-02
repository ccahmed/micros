import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <a routerLink="/">Mon Application</a>
      </div>
      <div class="navbar-menu">
        <ng-container *ngIf="isLoggedIn()">
          <a *ngIf="isAdmin()" routerLink="/dashboard" class="nav-link">Dashboard</a>
          <a routerLink="/profile" class="nav-link">Mon Profil</a>
          <button (click)="logout()" class="nav-link logout-btn">Déconnexion</button>
        </ng-container>
        <ng-container *ngIf="!isLoggedIn()">
          <a routerLink="/login" class="nav-link">Connexion</a>
          <a routerLink="/register" class="nav-link">Inscription</a>
        </ng-container>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #f8f9fa;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .navbar-brand a {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
      text-decoration: none;
    }

    .navbar-menu {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .nav-link {
      color: #666;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .nav-link:hover {
      color: #333;
      background-color: rgba(0,0,0,0.05);
    }

    .logout-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
    }

    .logout-btn:hover {
      color: #dc3545;
    }

    @media (max-width: 768px) {
      .navbar {
        padding: 1rem;
      }

      .navbar-menu {
        gap: 0.5rem;
      }

      .nav-link {
        padding: 0.5rem;
      }
    }
  `]
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
