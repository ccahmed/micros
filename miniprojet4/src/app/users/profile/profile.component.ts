import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/Model/user';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile-container">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Mon Profil</h2>
          <button type="button" class="close-button" (click)="goBack()">×</button>
        </div>
        
        <!-- Alert Messages -->
        <div *ngIf="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>
        <div *ngIf="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <!-- Profile Form -->
        <form (ngSubmit)="saveProfile()" #profileForm="ngForm" *ngIf="user">
          <div class="form-group">
            <label for="firstName">Prénom</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              [(ngModel)]="user.firstName"
              class="form-control"
              required
            >
          </div>

          <div class="form-group">
            <label for="lastName">Nom</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              [(ngModel)]="user.lastName"
              class="form-control"
              required
            >
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="user.email"
              class="form-control"
              required
            >
          </div>

          <div class="form-group">
            <label for="password">Nouveau mot de passe (optionnel)</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              class="form-control"
              placeholder="Laissez vide pour garder l'ancien mot de passe"
            >
          </div>

          <div class="button-group">
            <button type="submit" class="btn btn-primary" [disabled]="loading || !profileForm.form.valid">
              {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
            <button type="button" class="btn btn-secondary" (click)="goBack()" [disabled]="loading">
              Retour
            </button>
          </div>
        </form>

        <!-- Loading State -->
        <div *ngIf="loading" class="loading-spinner">
          Chargement...
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 2rem;
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .modal-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #666;
      cursor: pointer;
      padding: 0.5rem;
    }

    .close-button:hover {
      color: #333;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      border-color: #007bff;
      outline: none;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }

    .button-group {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #5a6268;
    }

    .alert {
      padding: 0.75rem 1rem;
      margin-bottom: 1rem;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .alert-danger {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .alert-success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .loading-spinner {
      text-align: center;
      padding: 1rem;
      color: #666;
    }

    @media (max-width: 576px) {
      .profile-container {
        padding: 1rem;
      }

      .modal-content {
        padding: 1rem;
      }

      .button-group {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  password: string = '';
  loading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showPassword: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Vérifier l'authentification avant de charger le profil
    if (!this.authService.isLoggedIn()) {
      console.log('Utilisateur non authentifié, redirection vers login');
      this.router.navigate(['/login']);
      return;
    }

    this.loadUserProfile();

    // S'abonner aux changements d'authentification
    this.subscriptions.push(
      this.authService.getUserEmail().subscribe(email => {
        if (!email) {
          console.log('Email utilisateur non disponible, redirection vers login');
          this.router.navigate(['/login']);
        }
      })
    );
  }

  ngOnDestroy() {
    // Nettoyer les souscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadUserProfile() {
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const subscription = this.dashboardService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
        console.log('Profil chargé avec succès:', user);
      },
      error: (error) => {
        this.loading = false;
        console.error('Erreur lors du chargement du profil:', error);
        if (error.status === 403) {
          this.errorMessage = 'Accès non autorisé - Vérifiez vos permissions';
          this.authService.logout();
          this.router.navigate(['/users/connection']);
        } else if (error.status === 401) {
          this.errorMessage = 'Session expirée - Veuillez vous reconnecter';
          this.authService.logout();
          this.router.navigate(['/users/connection']);
        } else {
          this.errorMessage = error.message || 'Une erreur est survenue lors du chargement du profil';
        }
      }
    });

    this.subscriptions.push(subscription);
  }

  saveProfile() {
    if (!this.user) {
      this.errorMessage = "Aucun utilisateur à mettre à jour";
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.errorMessage = "Session expirée. Veuillez vous reconnecter.";
      this.router.navigate(['/users/connection']);
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const userData = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      password: this.password || undefined
    };

    const subscription = this.dashboardService.updateUser(this.user.id.toString(), userData).subscribe({
      next: (response) => {
        console.log('Profil mis à jour avec succès:', response);
        this.loading = false;
        this.successMessage = "Profil mis à jour avec succès";
        this.password = '';
        
        if (response.email !== this.authService.getEmail()) {
          this.authService.updateUserEmail(response.email);
        }
        
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du profil:', error);
        this.loading = false;
        if (error.status === 403) {
          this.errorMessage = 'Accès non autorisé - Vérifiez vos permissions';
          this.authService.logout();
          this.router.navigate(['/users/connection']);
        } else if (error.status === 401) {
          this.errorMessage = 'Session expirée - Veuillez vous reconnecter';
          this.authService.logout();
          this.router.navigate(['/users/connection']);
        } else {
          this.errorMessage = error.message || 'Une erreur est survenue lors de la mise à jour du profil';
        }
      }
    });

    this.subscriptions.push(subscription);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goBack() {
    this.router.navigate(['/']);
  }
} 