import { Component, OnInit } from '@angular/core';
import { ProduitService } from '../services/produit.service';
import { SessionService } from '../services/session.service';
import { Produit } from '../Model/Produit';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  listProduitFront: Produit[] = [];
  notifcounter = 0;

  constructor(
    private produitService: ProduitService,
    private session: SessionService,
    private notifier: NotifierService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.produitService.afficherProduit().subscribe({
      next: (data) => {
        this.listProduitFront = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits:', error);
      }
    });
  }

  ProductInsidePanier(p: Produit): boolean {
    const panier = this.session.getPanier();
    return panier.some(item => item.produit.idProduit === p.idProduit);
  }

  ajouterPanier(p: Produit) {
    if (!this.session.getUser()) {
      this.notifier.notify('warning', 'Veuillez vous connecter pour ajouter au panier');
      this.router.navigate(['/users/connexion']);
      return;
    }
    this.session.addToPanier(p, 1);
    this.notifier.notify('info', 'vous pouvez maintenant visiter votre panier \n');
    this.notifcounter++;
    if (this.notifcounter == 3) {
      this.notifier.hideOldest();
    }
  }

  wish(p: Produit) {
    if (!this.session.getUser()) {
      this.notifier.notify('warning', 'Veuillez vous connecter pour ajouter aux favoris');
      this.router.navigate(['/users/connexion']);
      return;
    }
    p.valeur = true;
    this.produitService.ajouterProduit(p).subscribe();
    this.notifier.notify('info', 'Article ' + p.libelle + ' est ajouté à la liste des favoris \n');
    this.notifcounter++;
    if (this.notifcounter == 3) {
      this.notifier.hideOldest();
    }
  }
}
