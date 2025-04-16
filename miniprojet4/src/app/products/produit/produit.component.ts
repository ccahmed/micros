import { Component, OnInit } from '@angular/core';
import {SessionService} from "../../services/session.service";
import {CategorieProduitService} from "../../services/categorie-produit.service";
import {ProduitService} from "../../services/produit.service";
import {ActivatedRoute} from "@angular/router";
import {CategorieProduit} from "../../Model/CategorieProduit";
import {Produit} from "../../Model/Produit";
import {NoteProduit} from "../../Model/NoteProduit";
import {NoteProduitService} from "../../services/note-produit.service";
import {NotifierService} from "angular-notifier";
import {LikeDislike} from "../../Model/LikeDislike";
import {User} from "../../Model/user";
import {LikeDislikeService} from "../../services/like-dislike.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})
export class ProduitComponent implements OnInit {
  listProduit: Produit[] = [];
  listProduitFront: Produit[] = [];
  showFormTemplate: boolean = false;
  inputProduct: Produit = new Produit(
    0, '', '', new Date(), new Date(), 0,
    new CategorieProduit(), '', 0, 0, false
  );
  ProductInsideList: boolean = false;
  notifcounter = 0;
  currentUser: any;

  private readonly notifier: NotifierService;

  constructor(
    private route: ActivatedRoute,
    private service: ProduitService,
    private session: SessionService,
    private noteservice: NoteProduitService,
    notifierService: NotifierService,
    private LikeDislikeService: LikeDislikeService,
    private authService: AuthService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit(): void {
    this.currentUser = this.session.getUser();
    this.route.params.subscribe(params => {
      const idCat = params['id'];
      if (idCat) {
        this.loadProductsByCategory(idCat);
      } else {
        this.loadAllProducts();
      }
    });
  }

  loadProductsByCategory(idCat: string): void {
    this.service.afficherProduitByCat(idCat, this.currentUser?.idUser?.toString() || null)
      .subscribe({
        next: (data: Produit[]) => {
          this.listProduitFront = data;
          console.log('Produits par catégorie:', data);
        },
        error: (error) => {
          console.error('Erreur lors du chargement des produits:', error);
        }
      });
  }

  loadAllProducts(): void {
    this.service.afficherProduit()
      .subscribe({
        next: (data: Produit[]) => {
          this.listProduit = data;
          this.listProduitFront = data;
          console.log('Tous les produits:', data);
        },
        error: (error) => {
          console.error('Erreur lors du chargement des produits:', error);
        }
      });
  }

  supprimerProd(id: number) {
    this.service.supprimerProduit(id).subscribe(() => {
      this.loadAllProducts();
    });
  }

  updateRate(p: Produit) {
    let note = p.note;
    let pr = p;
    pr.note = new NoteProduit();
    note.produit = pr;
    note.produit.note.noteproduit = 4;

    this.route.paramMap.subscribe((params) => {
      this.noteservice.saveNote(note).subscribe();
      this.loadProductsByCategory(params.get('id') || '');
    });
  }

  saveProduct(p: Produit) {
    this.service.ajouterProduit(p).subscribe(() => {
      this.loadAllProducts();
    });
    this.showFormTemplate = false;
  }

  getUserType(): string {
    return this.session.getSessionType();
  }

  getUser(): number {
    const user = this.session.getUser();
    return user ? user.id : 0; // ou throw une erreur si nécessaire
  }
  

  showForm() {
    this.showFormTemplate = !this.showFormTemplate;
  }

  updateForm(p: Produit) {
    this.showFormTemplate = !this.showFormTemplate;
    this.inputProduct = p;
  }

  ajouterPanier(p: Produit) {
    this.session.addToPanier(p, 1);
    this.notifier.notify('info', 'vous pouvez maintenant visiter votre panier \n');
    this.notifcounter++;
    if (this.notifcounter == 3) {
      this.notifier.hideOldest();
    }
  }

  ProductInsidePanier(p: Produit): boolean {
    return this.session.getPanier().findIndex((e) => e.produit.idProduit == p.idProduit) != -1;
  }

 
}
