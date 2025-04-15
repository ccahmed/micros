package com.esprit.microservice.facture_micro.services;

import com.esprit.microservice.facture_micro.entities.Facture;
import java.util.List;

public interface IFactureService {
    List<Facture> retrieveAllFactures();
    Facture addFacture(Facture f);
    void deleteFacture(Long id);
    Facture updateFacture(Facture f);
    Facture retrieveFacture(Long id);
    Facture activateFacture(Long id);
} 