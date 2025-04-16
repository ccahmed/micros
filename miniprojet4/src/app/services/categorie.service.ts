import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategorieProduit } from '../Model/CategorieProduit';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  constructor(private http: HttpClient) { }

  public afficherCategories(): Observable<CategorieProduit[]> {
    return this.http.get<CategorieProduit[]>("/productCategory/retrieve-all-productsCategories");
  }

  public ajouterCategorie(c: CategorieProduit): Observable<CategorieProduit> {
    return this.http.post<CategorieProduit>("/productCategory/add-productCategory", c);
  }

  public modifierCategorie(c: CategorieProduit): Observable<CategorieProduit> {
    return this.http.put<CategorieProduit>("/productCategory/modify-productCategory", c);
  }

  public supprimerCategorie(id: number): Observable<void> {
    return this.http.delete<void>("/productCategory/remove-productCategory/" + id);
  }

  public getCategorie(id: number): Observable<CategorieProduit> {
    return this.http.get<CategorieProduit>("/productCategory/retrieve-productCategory/" + id);
  }
} 