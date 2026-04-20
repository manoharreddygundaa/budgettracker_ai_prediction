package com.fullStack.expenseTracker.dto.requests;

import lombok.Data;

@Data
public class ExportRequest {
    private String format;
    private String startDate;
    private String endDate;
    private String type;
}
