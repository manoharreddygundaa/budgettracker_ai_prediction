package com.fullStack.expenseTracker.controllers;

import com.fullStack.expenseTracker.models.Savings;
import com.fullStack.expenseTracker.services.SavingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savings")
@CrossOrigin(origins = "http://localhost:3000")
public class SavingsController {

    @Autowired
    private SavingsService savingsService;

    @PostMapping
    public ResponseEntity<Savings> createSavingsGoal(@RequestBody Savings savings) {
        Savings createdSavings = savingsService.createSavingsGoal(savings);
        return ResponseEntity.ok(createdSavings);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Savings>> getSavingsGoalsByUserId(@PathVariable Long userId) {
        List<Savings> savingsGoals = savingsService.getSavingsGoalsByUserId(userId);
        return ResponseEntity.ok(savingsGoals);
    }

    @GetMapping("/{savingsId}")
    public ResponseEntity<Savings> getSavingsGoalById(@PathVariable Long savingsId) {
        Savings savings = savingsService.getSavingsGoalById(savingsId);
        return ResponseEntity.ok(savings);
    }

    @PutMapping("/{savingsId}")
    public ResponseEntity<Savings> updateSavingsGoal(@PathVariable Long savingsId, @RequestBody Savings savings) {
        Savings updatedSavings = savingsService.updateSavingsGoal(savingsId, savings);
        return ResponseEntity.ok(updatedSavings);
    }

    @DeleteMapping("/{savingsId}")
    public ResponseEntity<Void> deleteSavingsGoal(@PathVariable Long savingsId) {
        savingsService.deleteSavingsGoal(savingsId);
        return ResponseEntity.noContent().build();
    }
}