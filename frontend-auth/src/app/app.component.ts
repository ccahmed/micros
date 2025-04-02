import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <!-- Navbar -->
    <nav *ngIf="!isDashboardRoute" class="navbar">
      <div class="nav-content">
        <a routerLink="/" class="nav-brand">Mon Application</a>
        <div class="nav-links">
          <ng-container *ngIf="!authService.isLoggedIn()">
            <a routerLink="/login">Connexion</a>
            <a routerLink="/register">Inscription</a>
          </ng-container>
          <ng-container *ngIf="authService.isLoggedIn()">
            <a routerLink="/dashboard" *ngIf="authService.isAdmin()">Dashboard</a>
            <a routerLink="/profile">Mon Profil</a>
            <a href="#" (click)="logout($event)">Déconnexion</a>
          </ng-container>
        </div>
      </div>
    </nav>
    
    <!-- Main Content -->
    <router-outlet></router-outlet>

    <!-- Footer -->
    <footer *ngIf="!isDashboardRoute" class="footer">
      <div class="footer-content">
        <p>&copy; 2024 Mon Application. Tous droits réservés.</p>
      </div>
    </footer>
  `,
  styles: [`
    .navbar {
      background-color: #2c3e50;
      padding: 1rem;
      color: white;
    }

    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-brand {
      color: white;
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .nav-links {
      display: flex;
      gap: 1rem;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .nav-links a:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .footer {
      background-color: #2c3e50;
      color: white;
      padding: 1rem;
      position: fixed;
      bottom: 0;
      width: 100%;
      text-align: center;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {
  isDashboardRoute: boolean = false;

  constructor(
    private router: Router,
    public authService: AuthService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isDashboardRoute = event.url === '/dashboard';
    });
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
