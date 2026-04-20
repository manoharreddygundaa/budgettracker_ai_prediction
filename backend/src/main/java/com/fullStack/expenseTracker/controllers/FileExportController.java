package com.fullStack.expenseTracker.controllers;

import com.fullStack.expenseTracker.models.Transaction;
import com.fullStack.expenseTracker.repository.TransactionRepository;
import com.fullStack.expenseTracker.security.UserDetailsImpl;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/mywallet/export")
@CrossOrigin("*")
public class FileExportController {

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping("/csv")
    public ResponseEntity<Resource> exportCSV() {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetween(
                userDetails.getId(), "1900-01-01", "2100-12-31");
            
            try (ByteArrayOutputStream out = new ByteArrayOutputStream();
                 OutputStreamWriter writer = new OutputStreamWriter(out);
                 CSVPrinter csv = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader(
                         "Date", "Description", "Amount", "Category", "Type"))) {
                
                for (Transaction t : transactions) {
                    csv.printRecord(t.getDate(), t.getDescription(), t.getAmount(), 
                                   t.getCategory().getCategoryName(),
                                   t.getCategory().getTransactionType().getTransactionTypeName().name());
                }
                csv.flush();
                
                ByteArrayResource resource = new ByteArrayResource(out.toByteArray());
                
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.csv")
                        .contentType(MediaType.parseMediaType("text/csv"))
                        .body(resource);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/excel")
    public ResponseEntity<Resource> exportExcel() {
        try (XSSFWorkbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetween(
                userDetails.getId(), "1900-01-01", "2100-12-31");
            
            Sheet sheet = workbook.createSheet("Transactions");
            
            // Header style
            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            
            // Header row
            Row header = sheet.createRow(0);
            String[] headers = {"Date", "Description", "Amount", "Category", "Type"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Data rows
            int rowNum = 1;
            for (Transaction t : transactions) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(t.getDate().toString());
                row.createCell(1).setCellValue(t.getDescription());
                row.createCell(2).setCellValue(t.getAmount());
                row.createCell(3).setCellValue(t.getCategory().getCategoryName());
                row.createCell(4).setCellValue(t.getCategory().getTransactionType().getTransactionTypeName().name());
            }
            
            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(out);
            ByteArrayResource resource = new ByteArrayResource(out.toByteArray());
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.xlsx")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/pdf")
    public ResponseEntity<Resource> exportPDF() {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetween(
                userDetails.getId(), "1900-01-01", "2100-12-31");
            
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