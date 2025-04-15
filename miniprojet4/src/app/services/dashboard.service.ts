import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../Model/user';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = '/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No token found');
      throw new Error('Token non trouvé');
    }
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Access-Control-Allow-Origin', 'http://localhost:4200');
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Une erreur s\'est produite:', error);
    
    if (error.status === 403 || error.status === 401) {
      console.log('Token utilisé:', this.authService.getToken());
      if (!this.authService.isLoggedIn()) {
        this.authService.logout();
        return throwError(() => new Error('Session expirée. Veuillez vous reconnecter.'));
      }
      return throwError(() => new Error('Accès non autorisé - Vérifiez vos permissions'));
    }
    return throwError(() => new Error('Une erreur est survenue lors de la communication avec le serveur'));
  }

  // Get current user profile
  getCurrentUser(): Observable<User> {
    const headers = this.getHeaders();
    return this.http.get<User>(`${this.apiUrl}/users/profile`, { headers }).pipe(
      tap(response => console.log('Profile response:', response)),
      catchError(this.handleError.bind(this))
    );
  }

  // Get all users
  getUsers(): Observable<User[]> {
    const headers = this.getHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers }).pipe(
      tap(users => console.log('Users retrieved:', users)),
      map(users => users.filter(user => user.role !== 'ADMIN')),
      catchError(this.handleError.bind(this))
    );
  }

  // Get user by ID
  getUserById(id: string): Observable<User> {
    const headers = this.getHeaders();
    return this.http.get<User>(`${this.apiUrl}/users/${id}`, { headers }).pipe(
      tap(user => console.log('User retrieved:', user)),
      catchError(this.handleError.bind(this))
    );
  }

  // Update user
  updateUser(userId: string, userData: any): Observable<User> {
    const headers = this.getHeaders();
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, userData, { headers }).pipe(
      tap(user => console.log('User updated:', user)),
      catchError(this.handleError.bind(this))
    );
  }

  // Delete user
  deleteUser(userId: string): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`, { headers }).pipe(
      tap(() => console.log('User deleted')),
      catchError(this.handleError.bind(this))
    );
  }
} 