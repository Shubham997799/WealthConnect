package com.example.Expance_management.UserService;

import com.example.Expance_management.Entity.Account;
import com.example.Expance_management.Entity.User;
import com.example.Expance_management.Repository.AccountRepository;
import com.example.Expance_management.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    public Account createAccount(Account account) {
        Optional<User> user = userRepository.findById(account.getUser().getId());
        if (user.isPresent()) {
            account.setUser(user.get());  // Ensure the user exists before saving
            account.setAccountOpeningDate(LocalDate.now());

            // Save the account to get the generated ID
            Account savedAccount = accountRepository.save(account);

            // Generate the account number using the ID
            savedAccount.setAccountNumber("1611" + String.format("%08d", savedAccount.getId()));

            // Save again with the generated account number
            return accountRepository.save(savedAccount);
        } else {
            throw new RuntimeException("User not found for ID: " + account.getUser().getId());
        }
    }

    public Optional<Account> getAccountById(Long id) {
        return accountRepository.findById(id);
    }

    public void deposit(Long accountId, double amount) {
        accountRepository.findById(accountId).ifPresentOrElse(account -> {
            System.out.println("Before Deposit: " + account.getBalance());
            account.setBalance(account.getBalance() + amount);
            accountRepository.save(account);
            System.out.println("After Deposit: " + account.getBalance());
        }, () -> {
            System.out.println("Account with ID " + accountId + " not found.");
        });
    }



    public void deleteAccount(Long id) {
        accountRepository.deleteById(id);
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public boolean transfer(Long fromAccountId, Long toAccountId, double amount) {
        Optional<Account> fromAccountOpt = accountRepository.findById(fromAccountId);
        Optional<Account> toAccountOpt = accountRepository.findById(toAccountId);

        if (fromAccountOpt.isPresent() && toAccountOpt.isPresent()) {
            Account fromAccount = fromAccountOpt.get();
            Account toAccount = toAccountOpt.get();

            if (fromAccount.getBalance() >= amount) {
                fromAccount.setBalance(fromAccount.getBalance() - amount);
                toAccount.setBalance(toAccount.getBalance() + amount);
                accountRepository.save(fromAccount);
                accountRepository.save(toAccount);
                return true;
            }
        }
		return false;
	}
}
