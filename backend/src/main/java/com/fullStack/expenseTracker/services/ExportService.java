package com.fullStack.expenseTracker.services;

import com.fullStack.expenseTracker.dto.requests.ExportRequest;
import org.springframework.core.io.ByteArrayResource;

public interface ExportService {
    ByteArrayResource exportData(Long userId, ExportRequest request);
    String getContentType(String format);
    String getFileName(String format);
}
