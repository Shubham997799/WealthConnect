package com.example.Expance_management.Repository;

import com.example.Expance_management.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<User, Long> {
}
