import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeModule } from './home/home.module';

/*import { CategorieProduitComponent } from './products/categorie-produit/categorie-produit.component';
import { ProduitComponent } from './products/produit/produit.component';
import { FormProduitComponent } from './products/form-produit/form-produit.component';
import { FormCategorieproduitComponent } from './products/form-categorieproduit/form-categorieproduit.component';
import { FormReclamationComponent } from './reclamations/form-reclamation/form-reclamation.component';
import { FormReponsereclamationComponent } from './reclamations/form-reponsereclamation/form-reponsereclamation.component';
import { StatReclamationComponent } from './reclamations/stat-reclamation/stat-reclamation.component';
import { ReclamationComponent } from './reclamations/reclamation/reclamation.component';
import { ReponseReclamationComponent } from './reclamations/reponse-reclamation/reponse-reclamation.component';*/
import {GoogleChartsModule} from "angular-google-charts";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidemenuComponent } from './sidemenu/sidemenu.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    SidemenuComponent,
    /*CategorieProduitComponent,
    ProduitComponent,
    FormProduitComponent,
    FormCategorieproduitComponent,
    FormReclamationComponent,
    FormReponsereclamationComponent,
    StatReclamationComponent,
    ReclamationComponent,
    ReponseReclamationComponent,*/
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    GoogleChartsModule,
    NgbModule,
    RouterModule,
    HomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
