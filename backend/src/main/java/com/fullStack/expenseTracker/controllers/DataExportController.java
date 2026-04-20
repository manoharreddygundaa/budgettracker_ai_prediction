package com.fullStack.expenseTracker.controllers;

import com.fullStack.expenseTracker.models.Transaction;
import com.fullStack.expenseTracker.repository.TransactionRepository;
import com.fullStack.expenseTracker.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/export")
@CrossOrigin("*")
public class DataExportController {

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping("/csv")
    public ResponseEntity<String> exportCSV() {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            List<Transaction> transactions = transactionRepository.findAllByUserId(userDetails.getId());
            
            StringBuilder csv = new StringBuilder();
            csv.append("Date,Description,Amount,Category,Type\n");
            
            for (Transaction t : transactions) {
                csv.append(t.getDate()).append(",")
                   .append("\"").append(t.getDescription()).append("\",")
                   .append(t.getAmount()).append(",")
                   .append("\"").append(t.getCategory().getCategoryName()).append("\",")
                   .append("\"").append(t.getCategory().getTransactionType().getTransactionTypeName().name()).append("\"")
                   .append("\n");
            }
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.csv")
                    .contentType(MediaType.parseMediaType("text/csv"))
                    .body(csv.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Export failed: " + e.getMessage());
        }
    }

   

    @GetMapping("/pdf")
    public ResponseEntity<ByteArrayResource> exportPDF() {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            List<Transaction> transactions = transactionRepository.findAllByUserId(userDetails.getId());
            
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            document.add(new Paragraph("Transaction Report").setFontSize(20).setBold());
            document.add(new Paragraph("Generated: " + LocalDate.now()));
            document.add(new Paragraph(" "));
            
            Table table = new Table(new float[]{2, 3, 2, 2, 2});
            table.addHeaderCell("Date");
            table.addHeaderCell("Description");
            table.addHeaderCell("Amount");
            table.addHeaderCell("Category");
            table.addHeaderCell("Type");
            
            for (Transaction t : transactions) {
                table.addCell(t.getDate().toString());
                table.addCell(t.getDescription());
                table.addCell(String.format("$%.2f", t.getAmount()));
                table.addCell(t.getCategory().getCategoryName());
                table.addCell(t.getCategory().getTransactionType().getTransactionTypeName().name());
            }
            
            document.add(table);
            document.close();
            
            ByteArrayResource resource = new ByteArrayResource(out.toByteArray());
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }    
}