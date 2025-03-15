package com.example.Expance_management.UserController;

import com.example.Expance_management.Entity.User;
import com.example.Expance_management.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserProfileController {

	@Autowired
	private UserRepository userRepository;

	@GetMapping("/{id}")
	public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
		Optional<User> user = userRepository.findById(id);
		if (user.isPresent()) {
			return ResponseEntity.ok(user.get());
		} else {
			return ResponseEntity.status(404).body("User not found");
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody User updatedUser) {
		return userRepository.findById(id).map(user -> {
			user.setFirstName(updatedUser.getFirstName());
			user.setLastName(updatedUser.getLastName());
			user.setEmail(updatedUser.getEmail());
			user.setPassword(updatedUser.getPassword()); // Consider encrypting the password
			userRepository.save(user);
			return ResponseEntity.ok(user);
		}).orElseThrow();
	}
}
