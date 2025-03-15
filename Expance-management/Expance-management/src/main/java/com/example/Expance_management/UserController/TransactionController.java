package com.example.Expance_management.UserController;

import com.example.Expance_management.Entity.Transaction;
import com.example.Expance_management.UserService.TransactionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transaction")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/record")
    public ResponseEntity<Transaction> recordTransaction(@RequestBody Transaction transaction) {
        return ResponseEntity.ok(transactionService.recordTransaction(transaction));
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<List<Transaction>> getTransactionsByAccount(@PathVariable Long accountId) {
        return ResponseEntity.ok(transactionService.getTransactionsByAccount(accountId));
    }
}
