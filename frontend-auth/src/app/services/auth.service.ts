import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  email: string;
  message: string;
  role: string;
}

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8084';
  private tokenKey = 'token';
  private emailKey = 'email';
  private roleKey = 'role';
  private userEmail = new BehaviorSubject<string | null>(localStorage.getItem(this.emailKey));
  private isAuthenticated = new BehaviorSubject<boolean>(this.checkInitialAuth());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkInitialAuth();
  }

  private checkInitialAuth(): boolean {
    const token = this.getToken();
    if (!token) {
      console.log('Pas de token trouvé');
      return false;
    }

    try {
      const decoded = this.decodeToken(token);
      const currentTime = Date.now() / 1000;
      const isValid = decoded.exp > currentTime;
      
      console.log('Token décodé:', decoded);
      console.log('Temps actuel:', currentTime);
      console.log('Expiration:', decoded.exp);
      console.log('Token valide:', isValid);
      
      if (!isValid) {
        console.log('Token expiré, nettoyage des données');
        this.clearAuthData();
      }
      
      return isValid;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      this.clearAuthData();
      return false;
    }
  }

  private clearAuthData(): void {
    console.log('Nettoyage des données d\'authentification');
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.emailKey);
    localStorage.removeItem(this.roleKey);
    this.userEmail.next(null);
    this.isAuthenticated.next(false);
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    console.log('Headers générés:', headers.keys());
    return headers;
  }

  private decodeToken(token: string): JwtPayload {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log('Token décodé avec succès:', decoded);
      
      // Extraire le rôle du token
      let role = decoded.role;
      
      // Si le rôle n'est pas directement dans le token, chercher dans realm_access
      if (!role && decoded.realm_access?.roles) {
        role = decoded.realm_access.roles.includes('ADMIN') ? 'ADMIN' : 'USER';
      }
      
      // Si toujours pas de rôle, chercher dans resource_access
      if (!role && decoded.resource_access) {
        const resourceRoles = Object.values(decoded.resource_access)
          .flatMap(resource => resource.roles || []);
        role = resourceRoles.includes('ADMIN') ? 'ADMIN' : 'USER';
      }
      
      // Mettre à jour le rôle dans le localStorage
      if (role) {
        localStorage.setItem(this.roleKey, role);
      }
      
      return decoded;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      throw error;
    }
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user)
      .pipe(
        catchError(error => {
          console.error('Erreur d\'inscription:', error);
          return throwError(() => error);
        })
      );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.token) {
            console.log('Login réussi, sauvegarde du token');
            localStorage.setItem(this.tokenKey, response.token);
            localStorage.setItem(this.emailKey, response.email);
            localStorage.setItem(this.roleKey, response.role);
            this.userEmail.next(response.email);
            this.isAuthenticated.next(true);
            
            // Décoder le token pour extraire les rôles
            this.decodeToken(response.token);
            
            if (this.isAdmin()) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/home']);
            }
          }
        }),
        catchError(error => {
          console.error('Erreur de connexion:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    console.log('Déconnexion de l\'utilisateur');
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const isAuth = this.isAuthenticated.value;
    console.log('État de connexion:', isAuth);
    return isAuth && this.checkInitialAuth();
  }

  getAuthStatus(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      console.log('Token récupéré du localStorage');
    } else {
      console.log('Pas de token dans le localStorage');
    }
    return token;
  }

  getEmail(): string | null {
    return localStorage.getItem(this.emailKey);
  }

  getUserEmail(): Observable<string | null> {
    return this.userEmail.asObservable();
  }

  updateUserEmail(newEmail: string): void {
    localStorage.setItem(this.emailKey, newEmail);
    this.userEmail.next(newEmail);
  }

  isAdmin(): boolean {
    const role = localStorage.getItem(this.roleKey);
    const token = this.getToken();
    
    if (token) {
      try {
        const decoded = this.decodeToken(token);
        return role === 'ADMIN' || 
               decoded.realm_access?.roles.includes('ADMIN') || 
               Object.values(decoded.resource_access || {}).some(r => r.roles?.includes('ADMIN'));
      } catch (error) {
        console.error('Erreur lors de la vérification du rôle admin:', error);
        return false;
      }
    }
    
    return role === 'ADMIN';
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  updateUser(userId: number, userData: any): Observable<any> {
    const options = {
      headers: this.getHeaders()
    };

    return this.http.put(`${this.apiUrl}/api/users/${userId}`, userData, options)
      .pipe(
        tap(response => {
          if (userData.email) {
            this.updateUserEmail(userData.email);
          }
        }),
        catchError(error => {
          console.error('Erreur de mise à jour utilisateur:', error);
          return throwError(() => error);
        })
      );
  }
}
