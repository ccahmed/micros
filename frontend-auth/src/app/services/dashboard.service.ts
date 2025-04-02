import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8084/api';

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
    console.log('Using token:', token);

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Accept', 'application/json');
    
    // Log the actual header values that will be sent
    console.log('Authorization header value:', headers.get('Authorization'));
    console.log('Content-Type header value:', headers.get('Content-Type'));
    console.log('Accept header value:', headers.get('Accept'));
    
    return headers;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Une erreur s\'est produite:', error);
    
    if (error.status === 403 || error.status === 401) {
      console.log('Token utilisé:', this.authService.getToken());
      console.log('Headers envoyés:', error.headers);
      console.log('URL appelée:', error.url);
      
      if (!this.authService.isLoggedIn()) {
        this.authService.logout();
        return throwError(() => new Error('Session expirée. Veuillez vous reconnecter.'));
      }
      return throwError(() => new Error('Accès non autorisé - Vous devez avoir les droits administrateur'));
    }
    return throwError(() => error);
  }

  // Get current user profile
  getCurrentUser(): Observable<User> {
    console.log('Récupération du profil utilisateur...');
    try {
      const headers = this.getHeaders();
      console.log('Headers envoyés:', headers.keys());
      return this.http.get<User>(`${this.apiUrl}/users/profile`, { headers })
        .pipe(
          tap(response => console.log('Réponse du serveur:', response)),
          catchError(this.handleError.bind(this))
        );
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Get all users
  getUsers(): Observable<User[]> {
    try {
      const headers = this.getHeaders();
      console.log('Headers pour getUsers:', headers.keys());
      console.log('Authorization header value:', headers.get('Authorization'));
      console.log('URL appelée:', `${this.apiUrl}/users`);
      
      return this.http.get<User[]>(`${this.apiUrl}/users`, { 
        headers,
        observe: 'response',
        withCredentials: true
      }).pipe(
        tap(response => {
          console.log('Response status:', response.status);
          console.log('Response headers:', response.headers);
          console.log('Response body:', response.body);
        }),
        map(response => response.body || []),
        map(users => users.filter(user => user.role !== 'ADMIN')),
        catchError(this.handleError.bind(this))
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Get user by ID
  getUserById(id: string): Observable<User> {
    try {
      const headers = this.getHeaders();
      return this.http.get<User>(`${this.apiUrl}/users/${id}`, { headers })
        .pipe(
          tap(user => console.log('User récupéré:', user)),
          catchError(this.handleError.bind(this))
        );
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Update user
  updateUser(userId: string, userData: any): Observable<User> {
    try {
      const headers = this.getHeaders();
      return this.http.put<User>(`${this.apiUrl}/users/${userId}`, userData, { headers })
        .pipe(
          tap(user => console.log('User mis à jour:', user)),
          catchError(this.handleError.bind(this))
        );
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Delete user
  deleteUser(userId: string): Observable<void> {
    try {
      const headers = this.getHeaders();
      return this.http.delete<void>(`${this.apiUrl}/users/${userId}`, { headers })
        .pipe(
          tap(() => console.log('User supprimé')),
          catchError(this.handleError.bind(this))
        );
    } catch (error) {
      return throwError(() => error);
    }
  }
} 