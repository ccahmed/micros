package com.example.projetmicroservicesrepasfiras.service;

import com.example.projetmicroservicesrepasfiras.Entity.User;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class PDFService {

    public byte[] generateUsersPDF(List<User> users) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Titre
        document.add(new Paragraph("Liste des Utilisateurs").setBold().setFontSize(20));

        // Tableau
        Table table = new Table(UnitValue.createPercentArray(4)).useAllAvailableWidth();
        
        // En-têtes
        table.addHeaderCell("ID");
        table.addHeaderCell("Nom");
        table.addHeaderCell("Email");
        table.addHeaderCell("Rôle");

        // Données
        for (User user : users) {
            table.addCell(user.getId().toString());
            table.addCell(user.getFirstName() + " " + user.getLastName());
            table.addCell(user.getEmail());
            table.addCell(user.getRole().toString());
        }

        document.add(table);
        document.close();

        return baos.toByteArray();
    }
} 