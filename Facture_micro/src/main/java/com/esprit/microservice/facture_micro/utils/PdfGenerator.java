package com.esprit.microservice.facture_micro.utils;

import com.esprit.microservice.facture_micro.entities.DetailFacture;
import com.esprit.microservice.facture_micro.entities.Facture;
import com.lowagie.text.DocumentException;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

public class PdfGenerator {

    public static String generateInvoicePdf(Facture facture) throws IOException, DocumentException {
        File pdfFolder = new File("pdfs");
        if (!pdfFolder.exists()) {
            pdfFolder.mkdirs();
        }


        String pdfFilePath = "pdfs/facture_" + facture.getIdFacture() + ".pdf";

        StringBuilder htmlContent = new StringBuilder();
        htmlContent.append("<html><head>")
                .append("<style>")
                .append("body { font-family: Arial, sans-serif; font-size: 12px; color: #333; margin: 0; padding: 20px; background-color: #f9f9f9; }")
                .append("h1 { color: #00bcd4; text-align: center; margin-bottom: 20px; }")
                .append("table { width: 100%; border-collapse: collapse; margin-top: 20px; }")
                .append("th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }")
                .append("th { background-color: #f1f1f1; }")
                .append(".total { font-weight: bold; font-size: 16px; margin-top: 20px; text-align: right; }")
                .append(".footer { margin-top: 40px; font-size: 14px; color: #888; text-align: center; }")
                .append("</style>")
                .append("</head><body>");

        htmlContent.append("<h1>Facture #" + facture.getIdFacture() + "</h1>");
        htmlContent.append("<p><strong>Montant total: </strong>").append(facture.getMontantFacture()).append("</p>");

        htmlContent.append("<table>");
        htmlContent.append("<tr><th>Produit</th><th>Quantité</th></tr>");

        List<DetailFacture> details = facture.getDetailFacture();
        for (DetailFacture detail : details) {
            htmlContent.append("<tr>")
                    .append("<td>").append(detail.getProductId()).append("</td>")
                    .append("<td>").append(detail.getQte()).append("</td>")
                    .append("</tr>");
        }

        htmlContent.append("</table>");

        htmlContent.append("<p class='total'>Merci pour votre commande !</p>");
        htmlContent.append("<div class='footer'><p>Si vous avez des questions, n'hésitez pas à nous contacter.</p></div>");
        htmlContent.append("</body></html>");

        try (FileOutputStream fileOut = new FileOutputStream(pdfFilePath)) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent.toString());
            renderer.layout();
            renderer.createPDF(fileOut);
        }

        return pdfFilePath;
    }
}
