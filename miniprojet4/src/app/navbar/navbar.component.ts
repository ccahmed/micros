import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../Model/user';
import { SessionService } from '../services/session.service';
import { AuthService } from '../services/auth.service';
import { CategorieService } from '../services/categorie.service';
import { CategorieProduit } from '../Model/CategorieProduit';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user2: User;
  data: any;
  check1: boolean;
  check2: boolean;
  check3: boolean;
  check4: boolean;

  listCatP: CategorieProduit[] = [];
  checkRec: boolean;
  categories: CategorieProduit[] = [];
  loading = true;
  error: string | null = null;

  constructor(private route: Router, private session : SessionService, private authService: AuthService, private categorieService: CategorieService) {
  }

  ngOnInit(): void {
    this.user2;
    this.check1 = true;
    this.check2 = false;
    this.check3 = false;
    this.check4 = false;
    this.checkRec = false;
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;
    this.categorieService.afficherCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.listCatP = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des catégories';
        this.loading = false;
        console.error('Erreur:', err);
      }
    });
  }

  changeCheck1() {
    this.check1 = true;
    this.check2 = false;
    this.check3 = false;
    this.check4 = false;
    this.checkRec = false;
  }
  changeCheck2() {
    this.check1 = false;
    this.check2 = true;
    this.check3 = false;
    this.check4 = false;
    this.checkRec = false;
  }
  changeCheck3() {
    this.check1 = false;
    this.check2 = false;
    this.check3 = true;
    this.check4 = false;
    this.checkRec = false;
  }
  changeCheck4() {
    this.check1 = false;
    this.check2 = false;
    this.check3 = false;
    this.check4 = true;
    this.checkRec = false;
  }
  changeCheckRec(){
    this.check1 = false;
    this.check2 = false;
    this.check3 = false;
    this.check4 = false;
    this.checkRec = true;
  }
  getUserType(): string {
    return this.session.getSessionType();
  }

  disconnect() {
    this.session.clearSession();
    this.route.navigate(['/home']);
  }

  isDashboard(): boolean {
    return this.route.url === '/users/dashboard';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isUser(): boolean {
    return this.authService.isUser();
  }

  logout(): void {
    this.authService.logout();
    this.route.navigate(['/users/connexion']);
  }
}
