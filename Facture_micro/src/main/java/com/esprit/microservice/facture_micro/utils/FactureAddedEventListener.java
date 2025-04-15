package com.esprit.microservice.facture_micro.utils;

import com.esprit.microservice.facture_micro.services.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
@Component
public class FactureAddedEventListener implements ApplicationListener<FactureAddedEvent> {

    private final EmailService emailService;

    @Autowired
    public FactureAddedEventListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @Override
    public void onApplicationEvent(FactureAddedEvent event) {
        // Récupérer la facture, ou ici on simule en utilisant un e-mail statique.
        // Vous pouvez personnaliser l'e-mail en fonction des détails de la facture
        String emailRecipient = "ikramsegni28@gmail.com"; // Utilisez un e-mail statique
        String subject = "Nouvelle facture ajoutée : #" + event.getFactureId();
        String message = "Bonjour, une nouvelle facture a été ajoutée avec l'ID " + event.getFactureId() + ".";

        // Chemin du fichier PDF généré
        String attachmentPath = "facture.pdf"; // Assurez-vous que le fichier PDF existe

        try {
            // Envoyer l'email avec le PDF en pièce jointe
            emailService.sendInvoiceEmailWithAttachment(emailRecipient, subject, message, attachmentPath);
        } catch (MessagingException e) {
            e.printStackTrace(); // Gérez l'exception ici, si nécessaire
        }
    }
}
