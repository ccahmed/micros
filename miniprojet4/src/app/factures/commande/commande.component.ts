import { Component, OnInit } from '@angular/core';
import { Facture } from "../../Model/Facture";
import { FactureService } from "../../services/facture.service";
import { SessionService } from "../../services/session.service";
import { DetailFactureService } from "../../services/detail-facture.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {
  facture: Facture;
  showFacture = true;
  showMessage = false;

  constructor(
    private route: Router,
    private factureService: FactureService,
    private sessionService: SessionService,
    private detailFactureService: DetailFactureService
  ) { }

  ngOnInit(): void {
    const user = this.sessionService.getUser();  // Récupérer l'utilisateur actuel de la session

    // Vérification si l'utilisateur est correctement récupéré
    console.log("Utilisateur récupéré: ", user);

    if (user == null) {
      this.route.navigate(['/users/connexion']);  // Rediriger vers la page de connexion si l'utilisateur n'est pas trouvé
    } else if (this.sessionService.getPanier().length <= 0) {
      this.route.navigate(['/factures/panier']);  // Rediriger si le panier est vide
    } else {
      this.facture = new Facture();
      this.facture.active = true;
      this.facture.dateFacture = new Date();

      // Récupérer l'utilisateur et l'assigner à la facture
      this.facture.user = user;
      console.log("ID de l'utilisateur assigné à la facture: ", user.id);

      // Vérification de l'ID de l'utilisateur assigné à la facture

      // Convertir le panier en facture
      this.factureService.FromPanierToFacture(this.facture, this.sessionService.getPanier());
    }
  }

  addFacture(f: Facture): void {
    const user = this.sessionService.getUser();
    if (user) {
      f.userId = user.id; // ✅ Attribut correct
      console.log("ID utilisateur assigné à la facture : ", f.userId);

      // Traiter chaque élément du panier et assigner les IDs des produits
      f.detailFacture.forEach(item => {
        item.productId = item.produit.idProduit;
      });

      // Ajouter la facture d'abord
      this.factureService.addFacture(f).subscribe({
        next: (fact) => {
          f.idFacture = fact.idFacture;

          // Ajouter tous les détails de la facture en une seule fois
          const detailsToAdd = f.detailFacture.map(item => {
            item.factureId = fact.idFacture;
            return this.detailFactureService.add(item, fact.idFacture);
          });

          // Attendre que tous les détails soient ajoutés
          Promise.all(detailsToAdd).then(() => {
            this.facture = new Facture();
            this.sessionService.setPanier([]);
            this.showFacture = false;
            this.BackToProduct();
          });
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de la facture:', error);
        }
      });
    }
  }

  BackToProduct(): void {
    this.showMessage = true;
  }
}
