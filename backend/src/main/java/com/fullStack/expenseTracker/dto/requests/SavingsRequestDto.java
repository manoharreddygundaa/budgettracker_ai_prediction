package com.fullStack.expenseTracker.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SavingsRequestDto {
    private Long userId;
    private String goalName;
    private Double targetAmount;
    private Double savedAmount;
    private LocalDate deadline;
}