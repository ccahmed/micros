package com.esprit.microservice.facture_micro.services;

import java.util.List;
import java.util.Optional;

import com.esprit.microservice.facture_micro.entities.DetailFacture;

public interface DetailFactureService {
	public List<DetailFacture> retrieveAlldetailFactures();
	public DetailFacture adddetailFacture(DetailFacture f);
	public void deletedetailFacture(Long id);
	public DetailFacture updatedetailFacture(DetailFacture f);
	public void retrievedetailFacture(Long id);
	public int updatedetailFactureQuantite(DetailFacture df);
	public void deleteDetailFacturesByFactureId(Long factureId) ;

	Optional<DetailFacture> findById(Long idDetailFacture);

}
