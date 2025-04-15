import { Produit } from "./Produit";

export class DetailFacture {
  idDetailFacture: number;
  qte: number;
  produit: Produit;
  productId: number;  // ID du produit pour correspondre avec l'entité backend
  factureId: number | null;  // Accepter null comme valeur valide
}
