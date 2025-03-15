package com.example.Expance_management.UserController;

import com.example.Expance_management.Entity.Account;
import com.example.Expance_management.UserService.AccountService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/account")
@CrossOrigin(origins = "*")
public class AccountController {

	@Autowired
	private AccountService accountService;

	@PostMapping("/create")
	public ResponseEntity<Account> createAccount(@RequestBody Account account) {
		Account createdAccount = accountService.createAccount(account);
		return new ResponseEntity<>(createdAccount, HttpStatus.CREATED);
	}

	@GetMapping
	public ResponseEntity<List<Account>> getAllAccounts() {
		List<Account> accounts = accountService.getAllAccounts();
		return ResponseEntity.ok(accounts);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Account> getAccountById(@PathVariable Long id) {
		Optional<Account> account = accountService.getAccountById(id);
		return account.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteAccount(@PathVariable Long id) {
		accountService.deleteAccount(id);
		return ResponseEntity.ok("Account deleted successfully!");
	}

	@PostMapping("/deposit/{accountId}")
	public ResponseEntity<String> deposit(@PathVariable Long accountId, @RequestParam double amount) {
		accountService.deposit(accountId, amount);
		return ResponseEntity.ok("Deposit successful");
	}

	@PostMapping("/transfer")
	public ResponseEntity<String> transfer(@RequestParam Long fromAccountId, @RequestParam Long toAccountId,
			@RequestParam double amount) {
		boolean success = accountService.transfer(fromAccountId, toAccountId, amount);
		return success ? ResponseEntity.ok("Transfer successful")
				: ResponseEntity.badRequest().body("Insufficient balance or invalid accounts.");
	}
}
