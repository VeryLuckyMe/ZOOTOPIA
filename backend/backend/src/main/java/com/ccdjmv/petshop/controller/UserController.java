package com.ccdjmv.petshop.controller;

import com.ccdjmv.petshop.entity.AddressEntity;
import com.ccdjmv.petshop.entity.CartEntity;
import com.ccdjmv.petshop.entity.UserEntity;
import com.ccdjmv.petshop.repository.UserRepository;
import com.ccdjmv.petshop.service.UserService;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired	
    private UserRepository userRepository;
    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody UserEntity user) {
        Optional<UserEntity> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("Email is already registered.");
        }

        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("CUSTOMER");
        }
        
        if (user.getCart() == null) {
        	CartEntity cart = new CartEntity();
        	cart.setUser(user);
        	user.setCart(cart);
        }

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<Map<String, String>> login(@RequestBody UserEntity user) {
        Optional<UserEntity> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isEmpty() || !existingUser.get().getPassword().equals(user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password."));
        }

        String role = existingUser.get().getRole();
        String message;
        if ("ADMIN".equalsIgnoreCase(role)) {
            message = "Admin login successful!";
        } else if ("CUSTOMER".equalsIgnoreCase(role)) {
            message = "Customer login successful!";
        } else {
            return ResponseEntity.status(403).body(Map.of("message", "Role not recognized."));
        }
        return ResponseEntity.ok(Map.of(
        	    "id", existingUser.get().getId().toString(), // Include user ID
        	    "message", message,
        	    "username", existingUser.get().getUsername(),
        	    "role", role,
        	    "email", existingUser.get().getEmail()
        	));
    }
    
    @GetMapping("/users")
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        List<UserEntity> users = userService.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<Map<String, String>> getUserProfile(@PathVariable String id) {
        try {
            Long userId = Long.parseLong(id);
            Optional<UserEntity> userEntity = userRepository.findById(userId);

            if (userEntity.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("message", "User not found."));
            }

            UserEntity user = userEntity.get();
            return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "email", user.getEmail(),
                "role", user.getRole()
            ));
        } catch (NumberFormatException e) {
            return ResponseEntity.status(400).body(Map.of("message", "Invalid user ID format."));
        }
    }
    
    @PostMapping("/postUser")
    public UserEntity postUser(@RequestBody UserEntity user) {
        return userService.postUser(user);
    }
    
    @DeleteMapping("/deleteUser/{userId}")
    public String deleteUser(@PathVariable Long userId) {
    	return userService.deleteUser(userId);
    }
    
    @PostMapping("/users/{id}/upload-profile-pic")
    public ResponseEntity<?> uploadProfileImage(
        @PathVariable Long id,
        @RequestParam("profileImage") MultipartFile imageFile
    ) {
        try {
            // Validate image file
            if (imageFile.isEmpty()) {
                return ResponseEntity.badRequest().body("No file uploaded.");
            }

            String contentType = imageFile.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Invalid file type. Please upload an image.");
            }

            // Find the user by ID
            Optional<UserEntity> optionalUser = userRepository.findById(id);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }

            // Convert the image file to Base64 string
            byte[] imageBytes = imageFile.getBytes();
            String profileImageBase64 = Base64.getEncoder().encodeToString(imageBytes);

            // Update the user's profile image
            UserEntity user = optionalUser.get();
            user.setProfileImage(profileImageBase64);
            userRepository.save(user);

            // Return the Base64 image string in the response
            return ResponseEntity.ok(Map.of("profileImage", profileImageBase64));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload profile image.");
        }
    }

    @GetMapping("/users/{id}/profile-image")
    public ResponseEntity<?> getProfileImage(@PathVariable Long id) {
        try {
            // Find the user by ID
            Optional<UserEntity> optionalUser = userRepository.findById(id);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }

            // Get the profile image
            UserEntity user = optionalUser.get();
            String profileImage = user.getProfileImage();

            if (profileImage == null || profileImage.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No profile image available.");
            }

            return ResponseEntity.ok(profileImage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve profile image.");
        }
    }

    @PutMapping("users/{id}/address")
    public ResponseEntity<String> updateUserAddress(
            @PathVariable Long id,
            @RequestBody AddressEntity addressEntity
    ) {
        try {
            userService.updateAddress(id, addressEntity);
            return ResponseEntity.ok("Address updated successfully.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update address.");
        }
    }
    
    @GetMapping("/user/findById/{id}")
    public Optional<UserEntity> findUserById(@PathVariable Long id) {
    	return userService.findUserById(id);
    }

}