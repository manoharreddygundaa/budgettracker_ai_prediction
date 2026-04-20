package com.fullStack.expenseTracker.services.impls;

import com.fullStack.expenseTracker.dto.requests.ExportRequest;
import com.fullStack.expenseTracker.models.Transaction;
import com.fullStack.expenseTracker.repository.TransactionRepository;
import com.fullStack.expenseTracker.services.ExportService;
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
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExportServiceImpl implements ExportService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Override
    public ByteArrayResource exportData(Long userId, ExportRequest request) {
        List<Transaction> transactions = getFilteredTransactions(userId, request.getStartDate(), request.getEndDate(), request.getType());
        
        byte[] data = switch (request.getFormat().toUpperCase()) {
            case "PDF" -> generatePDF(transactions);
            case "CSV" -> generateCSV(transactions);
            case "EXCEL" -> generateExcel(transactions);
            default -> throw new IllegalArgumentException("Invalid format");
        };
        
        return new ByteArrayResource(data);
    }

    private List<Transaction> getFilteredTransactions(Long userId, String start, String end, String type) {
        List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetween(userId, start, end);
        
        if (type != null && !type.isEmpty() && !type.equalsIgnoreCase("all")) {
            return transactions.stream()
                    .filter(t -> t.getCategory().getTransactionType().getTransactionTypeName().name().equalsIgnoreCase(type))
                    .collect(Collectors.toList());
        }
        
        return transactions;
    }

    private byte[] generatePDF(List<Transaction> transactions) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            document.add(new Paragraph("Transaction Report").setFontSize(20).setBold());
            document.add(new Paragraph("Generated: " + LocalDate.now().format(DateTimeFormatter.ISO_DATE)));
            document.add(new Paragraph("\n"));
            
            Table table = new Table(new float[]{2, 3, 2, 2, 2});
            table.addHeaderCell("Date");
            table.addHeaderCell("Description");
            table.addHeaderCell("Category");
            table.addHeaderCell("Type");
            table.addHeaderCell("Amount");
            
            double total = 0;
            for (Transaction t : transactions) {
                table.addCell(t.getDate().toString());
                table.addCell(t.getDescription());
                table.addCell(t.getCategory().getCategoryName());
                table.addCell(t.getCategory().getTransactionType().getTransactionTypeName().name());
                table.addCell(String.format("$%.2f", t.getAmount()));
                total += t.getCategory().getTransactionType().getTransactionTypeName().name().equals("INCOME") ? t.getAmount() : -t.getAmount();
            }
            
            document.add(table);
            document.add(new Paragraph("\nTotal: $" + String.format("%.2f", total)).setBold());
            document.close();
            
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("PDF generation failed", e);
        }
    }

    private byte[] generateCSV(List<Transaction> transactions) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
             OutputStreamWriter writer = new OutputStreamWriter(out);
             CSVPrinter csv = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader(
                     "Date", "Description", "Category", "Type", "Amount"))) {
            
            for (Transaction t : transactions) {
                csv.printRecord(t.getDate(), t.getDescription(), t.getCategory().getCategoryName(), 
                               t.getCategory().getTransactionType().getTransactionTypeName().name(), t.getAmount());
            }
            csv.flush();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("CSV generation failed", e);
        }
    }

    private byte[] generateExcel(List<Transaction> transactions) {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("Transactions");
            
            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            
            Row header = sheet.createRow(0);
            String[] headers = {"Date", "Description", "Category", "Type", "Amount"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            int rowNum = 1;
            for (Transaction t : transactions) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(t.getDate().toString());
                row.createCell(1).setCellValue(t.getDescription());
                row.createCell(2).setCellValue(t.getCategory().getCategoryName());
                row.createCell(3).setCellValue(t.getCategory().getTransactionType().getTransactionTypeName().name());
                row.createCell(4).setCellValue(t.getAmount());
            }
            
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Excel generation failed", e);
        }
    }

    @Override
    public String getContentType(String format) {
        return switch (format.toUpperCase()) {
            case "PDF" -> "application/pdf";
            case "CSV" -> "text/csv";
            case "EXCEL" -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            default -> "application/octet-stream";
        };
    }

    @Override
    public String getFileName(String format) {
        String date = LocalDate.now().format(DateTimeFormatter.ISO_DATE);
        return switch (format.toUpperCase()) {
            case "PDF" -> "transactions_" + date + ".pdf";
            case "CSV" -> "transactions_" + date + ".csv";
            case "EXCEL" -> "transactions_" + date + ".xlsx";
            default -> "transactions_" + date + ".dat";
        };
    }
}
