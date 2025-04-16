import {Produit} from "./Produit";

export class CategorieProduit {
  idCategorieProduit: number;
  libelle: string;
  categorieProduitIcone: string;
  produits:Produit[];

  constructor() {
    this.idCategorieProduit = 0;
    this.libelle = '';
    this.categorieProduitIcone = '';
  }
}
