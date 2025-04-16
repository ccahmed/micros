import { Injectable } from '@angular/core';
import {CategorieProduit} from "../Model/CategorieProduit";
import {HttpClient} from "@angular/common/http";
import {Produit} from "../Model/Produit";
import {Observable} from "rxjs";
import {NoteProduit} from "../Model/NoteProduit";

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = '';

  constructor(private http: HttpClient) { }

  public afficherProduitByCat(idCat: string | null, iduser: string | null): Observable<Produit[]> {
    return this.http.get<Produit[]>(`/product/retrieve-all-productsByCat/${idCat}/${iduser}`);
  }
  
  public afficherProduit(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`/product/retrieve-all-products`);
  }

  public ajouterProduit(p: Produit): Observable<Produit> {
    return this.http.post<Produit>(`/product/add-product`, p);
  }

  public modifierProduit(p: Produit): Observable<Produit> {
    return this.http.put<Produit>(`/product/modify-product`, p);
  }

  public supprimerProduit(id: number): Observable<void> {
    return this.http.delete<void>(`/product/remove-product/${id}`);
  }

  public getProduit(id: number): Observable<Produit> {
    return this.http.get<Produit>(`/product/retrieve-product/${id}`);
  }
  
  public getProduitnotes(id: number): Observable<NoteProduit> {
    return this.http.get<NoteProduit>(`/product/retrieve-productnote/${id}`);
  }
}
