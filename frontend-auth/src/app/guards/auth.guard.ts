import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      // Si l'utilisateur est connecté et essaie d'accéder à login/register
      if (state.url === '/login' || state.url === '/register') {
        this.router.navigate(['/home']);
        return false;
      }
      return true;
    }

    // Si l'utilisateur n'est pas connecté
    if (state.url !== '/login' && state.url !== '/register') {
      // Stocker l'URL de redirection
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    }
    return false;
  }
} 