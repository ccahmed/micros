package com.esprit.microservice.facture_micro.utils;

import org.springframework.context.ApplicationEvent;

public class FactureAddedEvent extends ApplicationEvent {
    private final Long factureId;

    public FactureAddedEvent(Object source, Long factureId) {
        super(source);
        this.factureId = factureId;
    }

    public Long getFactureId() {
        return factureId;
    }
}
