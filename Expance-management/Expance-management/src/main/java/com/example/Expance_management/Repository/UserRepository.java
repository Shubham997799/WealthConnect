package com.example.Expance_management.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Expance_management.Entity.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
