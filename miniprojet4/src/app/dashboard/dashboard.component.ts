import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Produit } from '../Model/Produit';
import { Reclamation } from '../Model/Reclamation';
import { DashboardService } from '../services/dashboard.service';
import { AuthService } from '../services/auth.service';
import { User } from '../Model/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activeTab: string = 'users';
  users: User[] = [];
  filteredUsers: User[] = [];
  products: Produit[] = [];
  reclamations: Reclamation[] = [];
  currentUser: User | null = null;
  loading: boolean = false;
  error: string | null = null;
  errorMessage: string | null = null;
  searchTerm: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Dashboard component initialized');
    this.checkAuthAndLoadData();
  }

  private checkAuthAndLoadData() {
    if (this.authService.isLoggedIn()) {
      console.log('User is logged in, checking role...');
      if (this.authService.isAdmin()) {
        console.log('User is admin, loading data...');
        this.loadCurrentUser();
        this.loadDashboardData();
      } else {
        console.error('User is not admin');
        this.errorMessage = 'Accès refusé - Vous devez être administrateur';
        this.router.navigate(['/home']);
      }
    } else {
      console.error('User is not logged in');
      this.router.navigate(['/login']);
    }
  }

  private loadCurrentUser() {
    this.dashboardService.getCurrentUser().subscribe({
      next: (user) => {
        console.log('Current user:', user);
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Error loading current user:', error);
        if (error.status === 401 || error.status === 403) {
          this.authService.logout();
          this.router.navigate(['/users/connexion']);
        }
      }
    });
  }

  loadDashboardData() {
    console.log('Loading users data...');
    this.dashboardService.getUsers().subscribe({
      next: (users) => {
        console.log('Users loaded successfully:', users);
        this.users = users;
        this.filteredUsers = [...users];
        this.applyFilters();
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error loading users:', error);
        if (error.status === 401 || error.status === 403) {
          this.errorMessage = error.message || 'Accès non autorisé';
          if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
          }
        } else {
          this.errorMessage = 'Erreur lors du chargement des utilisateurs';
        }
      }
    });
  }

  applyFilters() {
    // Appliquer la recherche
    if (this.searchTerm) {
      this.filteredUsers = this.users.filter(user => 
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredUsers = [...this.users];
    }

    // Appliquer le tri
    this.filteredUsers.sort((a, b) => {
      if (this.sortDirection === 'asc') {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    });
  }

  onSearch() {
    this.applyFilters();
  }

  toggleSort() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'users') {
      this.loadDashboardData();
    }
  }

  editUser(user: User) {
    if (!this.authService.isAdmin()) {
      this.errorMessage = 'Seuls les administrateurs peuvent modifier les utilisateurs';
      return;
    }
    console.log('Editing user:', user);
  }

  deleteUser(userId: number | string) {
    if (!this.authService.isAdmin()) {
      this.errorMessage = 'Seuls les administrateurs peuvent supprimer des utilisateurs';
      return;
    }
  
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      console.log('Deleting user:', userId);
      this.dashboardService.deleteUser(userId.toString()).subscribe({
        next: () => {
          console.log('User deleted successfully');
          this.users = this.users.filter(user => user.id !== Number(userId));
          this.applyFilters();
          this.errorMessage = null;
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          
          if (error.status === 403 || error.status === 401) {
            this.errorMessage = 'Accès non autorisé. Vous devez être administrateur.';
            if (!this.authService.isLoggedIn()) {
              this.authService.logout();
              this.router.navigate(['/login']);
            }
          } else {
            this.errorMessage = error.message || 'Erreur lors de la suppression de l\'utilisateur';
          }
        }
      });
    }
  }

  logout() {
    console.log('Logging out...');
    this.authService.logout();
    this.router.navigate(['/users/connexion']);
  }

  openAddUserModal(): void {
    if (!this.authService.isAdmin()) {
      this.errorMessage = 'Seuls les administrateurs peuvent ajouter des utilisateurs';
      return;
    }
    console.log('Opening add user modal');
  }
}