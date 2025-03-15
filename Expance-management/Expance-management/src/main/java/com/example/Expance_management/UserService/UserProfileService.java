package com.example.Expance_management.UserService;

import com.example.Expance_management.Entity.User;
import com.example.Expance_management.Repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    public UserProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public Optional<User> getUserProfileById(Long id) {
        return userProfileRepository.findById(id);
    }

    public User saveUserProfile(User user) {
        return userProfileRepository.save(user);
    }
}
