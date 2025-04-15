package com.esprit.microservice.facture_micro.services;

import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.JavaMailSender;
import jakarta.mail.MessagingException;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class EmailService {

    private final JavaMailSender emailSender;

    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendInvoiceEmailWithAttachment(String to, String subject, String text, String pdfFilePath) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true); // true pour ajouter une pièce jointe

        helper.setTo(to);
        helper.setSubject(subject);

        // HTML du corps de l'email avec des améliorations de style
        String emailContent = "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; color: #333; background-color: #f4f4f9; margin: 0; padding: 0; }" +
                "h1 { color: #00bcd4; font-size: 24px; text-align: center; margin-top: 20px; }" +
                ".content { background-color: white; padding: 20px; margin: 20px auto; width: 80%; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }" +
                ".footer { font-size: 14px; color: #888; margin-top: 30px; text-align: center; }" +
                ".cta-button { background-color: #00bcd4; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none; font-weight: bold; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='content'>" +
                "<h1>Merci pour votre commande !</h1>" +
                "<p>" + text + "</p>" +
                "<p>Vous trouverez ci-joint la facture de votre achat.</p>" +
                "<p><a href='#' class='cta-button'>Voir votre commande</a></p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>" +
                "<p><a href='#'>Visitez notre site</a></p>" +
                "</div>" +
                "</body>" +
                "</html>";

        helper.setText(emailContent, true); // true signifie que le contenu est du HTML

        // Ajouter la pièce jointe PDF
        File pdfFile = new File(pdfFilePath);
        if (pdfFile.exists()) {
            helper.addAttachment("Invoice_" + pdfFile.getName(), pdfFile); // Renomme la pièce jointe avec un nom dynamique
        } else {
            throw new MessagingException("Le fichier PDF n'a pas été trouvé à l'emplacement : " + pdfFilePath);
        }

        // Envoyer l'email
        emailSender.send(message);
    }
}
