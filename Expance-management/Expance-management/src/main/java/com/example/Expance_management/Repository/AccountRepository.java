package com.example.Expance_management.Repository;

import com.example.Expance_management.Entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
}
