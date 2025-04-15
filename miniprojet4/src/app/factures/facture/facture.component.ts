import { Component, OnInit } from '@angular/core';
import {FactureService} from "../../services/facture.service";
import {Facture} from "../../Model/Facture";
import {DetailFacture} from "../../Model/detailFacture";
import {DetailFactureService} from "../../services/detail-facture.service";
import {jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css']
})
export class FactureComponent implements OnInit {
  factureList:Facture[] = [];
  facture:Facture;
  displayall:boolean=true;
  modeCorriger:boolean=false;
  pdfOn=false;
  loading:boolean = false;
  error:string = '';

  constructor(
    private factureService: FactureService,
    private detailFactureService:DetailFactureService
  ) { }

  ngOnInit(): void {
    this.loadFactures();
  }

  loadFactures() {
    this.loading = true;
    this.error = '';
    console.log('Chargement des factures...');
    this.factureService.getFactures().subscribe({
      next: (res) => {
        console.log('Factures reçues:', res);
        this.factureList = res;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des factures:', error);
        this.error = 'Erreur lors du chargement des factures';
        this.loading = false;
      }
    });
  }

  ChangeDisplay(f:Facture){
    console.log('Affichage des détails de la facture:', f);
    this.facture = f;
    this.displayall = false;
  }

  delete(id:number) {
    if(confirm("Voulez-vous vraiment supprimer cette facture ?")) {
      this.loading = true;
      this.factureService.deleteFacture(id).subscribe({
        next: () => {
          console.log('Facture supprimée avec succès');
          this.loadFactures();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.error = 'Erreur lors de la suppression de la facture';
          this.loading = false;
        }
      });
    }
  }

  supprimerDetail(id:number) {
    this.loading = true;
    this.detailFactureService.deleteDetailFacture(id).subscribe({
      next: () => {
        console.log('Détail de facture supprimé avec succès');
        this.factureService.updateMontant(this.facture.idFacture);
        this.loadFactureDetails();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression du détail:', error);
        this.error = 'Erreur lors de la suppression du détail';
        this.loading = false;
      }
    });
  }

  loadFactureDetails() {
    this.loading = true;
    this.factureService.getFacture(this.facture.idFacture).subscribe({
      next: (res) => {
        console.log('Détails de la facture reçus:', res);
        this.facture = res;
        this.factureService.getFacture(this.facture.idFacture).subscribe(res => {
          this.facture.montantFacture = res.montantFacture;
          this.loading = false;
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails:', error);
        this.error = 'Erreur lors du chargement des détails de la facture';
        this.loading = false;
      }
    });
  }

  updateDetailFactureQuantite(df:DetailFacture){
    this.loading = true;
    this.detailFactureService.UpdateDetailFactureQuantite(df).subscribe({
      next: () => {
        console.log('Quantité mise à jour avec succès');
        this.factureService.updateMontant(this.facture.idFacture);
        this.loadFactureDetails();
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        this.error = 'Erreur lors de la mise à jour de la quantité';
        this.loading = false;
      }
    });
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async exportAsPDF(divId:string) {
    this.pdfOn=true;
    await this.sleep(2000);
    const data = document.getElementById('MyFacture')!;

    html2canvas(data)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
        });
        const imgProps= pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(this.facture.idFacture+"#"+this.facture.user.email+"#"+new Date().toString()+".pdf");
      });
    await this.sleep(2000);
    this.pdfOn=false;
  }
}
