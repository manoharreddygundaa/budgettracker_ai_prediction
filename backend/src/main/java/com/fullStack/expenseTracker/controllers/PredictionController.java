package com.fullStack.expenseTracker.controllers;

import com.fullStack.expenseTracker.dto.reponses.ApiResponseDto;
import com.fullStack.expenseTracker.dto.reponses.ExpensePredictionDto;
import com.fullStack.expenseTracker.enums.ApiResponseStatus;
import com.fullStack.expenseTracker.security.UserDetailsImpl;
import com.fullStack.expenseTracker.services.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/mywallet/predictions")
public class PredictionController {

    @Autowired
    private PredictionService predictionService;

    @GetMapping("/expenses")
    public ResponseEntity<ApiResponseDto<ExpensePredictionDto>> predictExpenses(
            @RequestParam(defaultValue = "1") int monthsAhead,
            Authentication authentication) {
        
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String userEmail = userDetails.getEmail();
            
            System.out.println("Prediction API called with monthsAhead: " + monthsAhead + " for user: " + userEmail);
            
            ExpensePredictionDto prediction = predictionService.predictMonthlyExpenses(userEmail, monthsAhead);
            
            return ResponseEntity.ok(new ApiResponseDto<>(ApiResponseStatus.SUCCESS, HttpStatus.OK, prediction));
                    
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(ApiResponseStatus.FAILED, HttpStatus.BAD_REQUEST, null));
        }
    }

    @GetMapping("/expenses/{monthsAhead}")
    public ResponseEntity<ApiResponseDto<ExpensePredictionDto>> predictExpensesForSpecificMonth(
            @PathVariable int monthsAhead,
            Authentication authentication) {
        
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String userEmail = userDetails.getEmail();
            
            ExpensePredictionDto prediction = predictionService.predictMonthlyExpenses(userEmail, monthsAhead);
            
            return ResponseEntity.ok(new ApiResponseDto<>(ApiResponseStatus.SUCCESS, HttpStatus.OK, prediction));
                    
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(ApiResponseStatus.FAILED, HttpStatus.BAD_REQUEST, null));
        }
    }
}