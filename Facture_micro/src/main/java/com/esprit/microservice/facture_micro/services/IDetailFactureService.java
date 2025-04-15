package com.esprit.microservice.facture_micro.services;

import com.esprit.microservice.facture_micro.entities.DetailFacture;
import java.util.List;

public interface IDetailFactureService {
    List<DetailFacture> retrieveAllDetailFactures();
    DetailFacture addDetailFacture(DetailFacture df);
    void deleteDetailFacture(Long id);
    DetailFacture updateDetailFacture(DetailFacture df);
    DetailFacture retrieveDetailFacture(Long id);
    int updateDetailFactureQuantite(DetailFacture df);
} 