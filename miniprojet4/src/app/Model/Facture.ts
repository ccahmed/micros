import { User } from "./user";
import { DetailFacture } from "./detailFacture";

export class Facture {
  idFacture: number;
  active: boolean;
  dateFacture: Date;
  montantFacture: number;
  userId: number;  // Ajouter userId pour correspondre au modèle backend
  user: User;  // Garder la référence à l'utilisateur complet
  detailFacture: DetailFacture[];

  constructor() {
    this.userId = 0;  // Initialiser avec une valeur par défaut si nécessaire
  }
}
