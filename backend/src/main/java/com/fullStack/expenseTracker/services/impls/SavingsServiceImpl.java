package com.fullStack.expenseTracker.services.impls;

import com.fullStack.expenseTracker.models.Savings;
import com.fullStack.expenseTracker.repository.SavingsRepository;
import com.fullStack.expenseTracker.services.SavingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SavingsServiceImpl implements SavingsService {

    @Autowired
    private SavingsRepository savingsRepository;

    @Override
    public Savings createSavingsGoal(Savings savings) {
        return savingsRepository.save(savings);
    }

    @Override
    public List<Savings> getSavingsGoalsByUserId(Long userId) {
        return savingsRepository.findByUserId(userId);
    }

    @Override
    public Savings updateSavingsGoal(Long savingsId, Savings savings) {
        Savings existingSavings = savingsRepository.findById(savingsId)
                .orElseThrow(() -> new RuntimeException("Savings goal not found"));
        
        existingSavings.setGoalName(savings.getGoalName());
        existingSavings.setTargetAmount(savings.getTargetAmount());
        existingSavings.setSavedAmount(savings.getSavedAmount());
        existingSavings.setDeadline(savings.getDeadline());
        
        return savingsRepository.save(existingSavings);
    }

    @Override
    public void deleteSavingsGoal(Long savingsId) {
        savingsRepository.deleteById(savingsId);
    }

    @Override
    public Savings getSavingsGoalById(Long savingsId) {
        return savingsRepository.findById(savingsId)
                .orElseThrow(() -> new RuntimeException("Savings goal not found"));
    }
}