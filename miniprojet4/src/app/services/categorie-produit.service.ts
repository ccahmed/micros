import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CategorieProduit} from "../Model/CategorieProduit";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategorieProduitService {
  private apiUrl = '/api';

  constructor(private http:HttpClient) {}

  public afficherCategoriesProduit(): Observable<CategorieProduit[]> {
    return this.http.get<CategorieProduit[]>(`${this.apiUrl}/productCategory/retrieve-all-productsCategories`);
  }

  public saveCategorieProduit(cat: CategorieProduit): Observable<CategorieProduit> {
    return this.http.post<CategorieProduit>(`${this.apiUrl}/productCategory/add-productCategory`, cat);
  }

  public supprimerCategorieProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/productCategory/remove-productCategory/${id}`);
  }

  public getCategorieProduit(id: number): Observable<CategorieProduit> {
    return this.http.get<CategorieProduit>(`${this.apiUrl}/productCategory/retrieve-productCategory/${id}`);
  }
}
