package com.fullStack.expenseTracker.controllers;

import com.fullStack.expenseTracker.dto.requests.ExportRequest;
import com.fullStack.expenseTracker.security.UserDetailsImpl;
import com.fullStack.expenseTracker.services.ExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/export")
@CrossOrigin("*")
public class ExportController {

    @Autowired
    private ExportService exportService;

    @PostMapping
    public ResponseEntity<ByteArrayResource> exportData(@RequestBody ExportRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ByteArrayResource resource = exportService.exportData(userDetails.getId(), request);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                       "attachment; filename=" + exportService.getFileName(request.getFormat()))
                .contentType(MediaType.parseMediaType(exportService.getContentType(request.getFormat())))
                .body(resource);
    }
}
