package com.esprit.microservice.facture_micro.repositories;

import com.esprit.microservice.facture_micro.entities.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {


    @Query("SELECT f FROM Facture f LEFT JOIN FETCH f.detailFacture WHERE f.idFacture = :id")
    Facture findFactureWithDetails(@Param("id") Long idFacture);

}
