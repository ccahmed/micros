package com.esprit.microservice.facture_micro.repositories;

import com.esprit.microservice.facture_micro.entities.DetailFacture;
import com.esprit.microservice.facture_micro.entities.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface DetailFactureRepository extends JpaRepository<DetailFacture, Long> {
	@Modifying
	@Transactional
	@Query("UPDATE DetailFacture d SET d.qte = :qte WHERE d.idDetailFacture = :id")
	int updatedetailFactureQuantite(@Param("qte") Integer qte, @Param("id") Long id);
	List<DetailFacture> findByFacture(Facture facture);
	@Query("SELECT d FROM DetailFacture d WHERE d.facture.idFacture = :factureId")
	List<DetailFacture> findByFactureId(@Param("factureId") Long factureId);
}
