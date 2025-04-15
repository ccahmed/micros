import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FacturesRoutingModule } from './factures-routing.module';
import { FacturesComponent } from './factures.component';
import { FactureComponent } from './facture/facture.component';
import { CommandeComponent } from './commande/commande.component';
import { PanierComponent } from './panier/panier.component';
import { FormDetailFactureComponent } from './form-detail-facture/form-detail-facture.component';
import { NgxPrintModule } from 'ngx-print';
import { CodePromoModule } from '../code-promo/code-promo.module';
import { FilterPipe } from './pipes/filter.pipe';

@NgModule({
  declarations: [
    FacturesComponent,
    FactureComponent,
    CommandeComponent,
    PanierComponent,
    FormDetailFactureComponent,
    FilterPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FacturesRoutingModule,
    NgxPrintModule,
    CodePromoModule
    
  ]
})
export class FacturesModule { }
