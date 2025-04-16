import { Injectable } from '@angular/core';
import { User } from '../Model/user';
import { Panier } from '../Model/Panier';
import { Produit } from '../Model/Produit';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() {
    if (!localStorage.getItem('panier')) {
      localStorage.setItem('panier', JSON.stringify([]));
    }
  }

  // --- USER ---
  getUser(): User {
    const data = localStorage.getItem('user');
    if (data) {
      return JSON.parse(data);
    }
  
    // Return a default User if not found
    return {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      verificationCode: '',
      role: 'USER',
      resetToken: '',
      tokenExpiration: new Date()
    };
  }
  

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getSessionType(): 'USER' | 'ADMIN' | 'NL' {
    const user = this.getUser();
    if (user) {
      if (user.role === 'USER') return 'USER';
      if (user.role === 'ADMIN') return 'ADMIN';
    }
    return 'NL';
  }

  // --- PANIER ---
  setPanier(panier: Panier[]): void {
    localStorage.setItem('panier', JSON.stringify(panier));
  }

  getPanier(): Panier[] {
    const data = localStorage.getItem('panier');
    return data ? JSON.parse(data) : [];
  }

  addToPanier(produit: Produit, quantite: number): void {
    const panier = this.getPanier();
    const existingIndex = panier.findIndex((item: Panier) => item.produit.idProduit === produit.idProduit);

    if (existingIndex !== -1) {
      panier[existingIndex].quantite += quantite;
    } else {
      panier.push({ produit, quantite });
    }

    this.setPanier(panier);
  }

  // --- SESSION ---
  clearSession(): void {
    localStorage.clear();
    localStorage.setItem('panier', JSON.stringify([]));
  }

  // --- TOKEN ---
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
