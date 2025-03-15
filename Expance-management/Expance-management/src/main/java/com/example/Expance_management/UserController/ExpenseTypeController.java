package com.example.Expance_management.UserController;

import com.example.Expance_management.Entity.ExpenseType;
import com.example.Expance_management.UserService.ExpenseTypeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenseType")
@CrossOrigin(origins = "*")
public class ExpenseTypeController {

    @Autowired
    private ExpenseTypeService expenseTypeService;

    @PostMapping("/add")
    public ResponseEntity<ExpenseType> addExpenseType(@RequestBody ExpenseType expenseType) {
        return ResponseEntity.ok(expenseTypeService.addExpenseType(expenseType));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ExpenseType>> getAllExpenseTypes() {
        return ResponseEntity.ok(expenseTypeService.getAllExpenseTypes());
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<Void> removeExpenseType(@PathVariable Long id) {
        expenseTypeService.removeExpenseType(id);
        return ResponseEntity.ok().build();
    }
}
