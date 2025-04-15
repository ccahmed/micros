package com.esprit.microservice.facture_micro.services;

import java.util.List;
import com.esprit.microservice.facture_micro.entities.Facture;

public interface FactureService {
    List<Facture> retrieveAllFactures();
    Facture addFacture(Facture f);
    void deleteFacture(Long id);
    Facture updateFacture(Facture f);
    Facture retrieveFacture(Long id);
    Facture activateFacture(Long id);
} 