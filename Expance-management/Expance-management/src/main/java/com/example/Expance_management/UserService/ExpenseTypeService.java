package com.example.Expance_management.UserService;

import com.example.Expance_management.Entity.ExpenseType;
import com.example.Expance_management.Repository.ExpenseTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseTypeService {

    @Autowired
    private ExpenseTypeRepository expenseTypeRepository;

    public ExpenseType addExpenseType(ExpenseType expenseType) {
        return expenseTypeRepository.save(expenseType);
    }

    public List<ExpenseType> getAllExpenseTypes() {
        return expenseTypeRepository.findAll();
    }

    public void removeExpenseType(Long id) {
        expenseTypeRepository.deleteById(id);
    }
}
