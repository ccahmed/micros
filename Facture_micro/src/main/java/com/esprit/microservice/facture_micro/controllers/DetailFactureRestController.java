package com.esprit.microservice.facture_micro.controllers;

import java.util.List;

import com.esprit.microservice.facture_micro.entities.Facture;
import com.esprit.microservice.facture_micro.services.DetailFactureServiceImpl;
import com.esprit.microservice.facture_micro.services.FactureServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.esprit.microservice.facture_micro.entities.DetailFacture;
import com.esprit.microservice.facture_micro.services.DetailFactureService;
@Tag(name = "Detail Facture Controller", description = "Gestion des détails des factures")
@RestController
@RequestMapping("/DetailFacture")
public class DetailFactureRestController {
	@Autowired
	DetailFactureServiceImpl detailFactureService;
	@Autowired
	FactureServiceImpl factureService;


	//http://localhost:8082/SpringMVC/DetailFacture/retrieve-all-detailFactures
	@Operation(summary = "Récupérer tous les détails des factures")
	@GetMapping("/retrieve-all-detailFactures")
	@ResponseBody
	public List<DetailFacture> getDetailFactures() {
		List<DetailFacture> listdetailFacture = detailFactureService.retrieveAlldetailFactures();
		return listdetailFacture;
	}


	@Operation(summary = "Ajouter un détail de facture")
	@PostMapping("/add/{facture-id}")
	@ResponseBody
	public DetailFacture add(@RequestBody DetailFacture df,@PathVariable("facture-id") Long idFacture) {
		Facture f = factureService.retrieveFacture(idFacture);
	
		df.setFacture(f);
		return detailFactureService.adddetailFacture(df);
	}


	//http://localhost:8082/SpringMVC/DetailFacture/modify
	@Operation(summary = "modifier un détail de facture")
	@PutMapping("/modify")
	@ResponseBody
	public ResponseEntity<DetailFacture> updateDetailFacture(@RequestBody DetailFacture detailFacture) {
		// Vérifiez si le détail de facture existe
		DetailFacture existingDetailFacture = detailFactureService.findById(detailFacture.getIdDetailFacture())
				.orElseThrow(() -> new IllegalArgumentException("Le détail de facture n'existe pas."));

		// Récupérer la facture associée en fonction de l'id stocké dans le détail de facture existant
		Facture facture = existingDetailFacture.getFacture();
		if (facture == null) {
			throw new IllegalArgumentException("La facture associée à ce détail n'existe pas.");
		}

		// Mettre à jour les informations du détail de facture
		existingDetailFacture.setProductId(detailFacture.getProductId());
		existingDetailFacture.setQte(detailFacture.getQte());

		// Sauvegarder la mise à jour
		DetailFacture updatedDetailFacture = detailFactureService.updatedetailFacture(existingDetailFacture);

		return ResponseEntity.ok(updatedDetailFacture);
	}




	@Operation(summary = "modifier quantite d'un détail de facture")
	@PutMapping("/modify/quantite")
	@ResponseBody
	public int modifyDetailFacturequantite(@RequestBody DetailFacture df) {
		return detailFactureService.updatedetailFactureQuantite(df);
	}
	@Operation(summary = "Supprimer un détail de facture")
	@DeleteMapping("/remove/{detailfacture-id}")
	@ResponseBody
	public ResponseEntity<String> removeDetailFacture(@PathVariable("detailfacture-id") Long detailfactureId) {
		try {
			detailFactureService.deletedetailFacture(detailfactureId);
			return ResponseEntity.ok("Détail de facture supprimé avec succès.");
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	@Operation(summary = "Supprimer tous les détails de facture pour une facture donnée")
	@DeleteMapping("/remove/details/{facture-id}")
	@ResponseBody
	public ResponseEntity<String> removeDetailFacturesByFactureId(@PathVariable("facture-id") Long factureId) {
		try {
			detailFactureService.deleteDetailFacturesByFactureId(factureId);
			return ResponseEntity.ok("Tous les détails de facture associés à la facture ID " + factureId + " ont été supprimés avec succès.");
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}


}
