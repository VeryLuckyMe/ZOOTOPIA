package com.ccdjmv.petshop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ccdjmv.petshop.entity.AddressEntity;
import com.ccdjmv.petshop.entity.CartEntity;
import com.ccdjmv.petshop.entity.UserEntity;
import com.ccdjmv.petshop.repository.AddressRepository;
import com.ccdjmv.petshop.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public String signUp(UserEntity user) {
        Optional<UserEntity> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return "Email already registered!";
        }
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("CUSTOMER");
        }
        userRepository.save(user);
        return "User registered successfully!";
    }

    public Optional<UserEntity> login(String email, String password) {
        Optional<UserEntity> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent() && optionalUser.get().getPassword().equals(password)) {
            return optionalUser;
        }
        return Optional.empty();
    }

    public List<UserEntity> findAll() {
        return userRepository.findAll();
    }

    public Optional<UserEntity> findById(Long id) {
        return userRepository.findById(id);
    }

    public UserEntity createOrUpdateUser(UserEntity user) {
        return userRepository.save(user);
    }

    public String deleteUser(Long userId) {
        String msg = "";
		if (userRepository.findById(userId).isPresent()) {
			userRepository.deleteById(userId);;
			msg = "User Successfully deleted";
		}else {
			msg = userId + " NOT found";
		}
		return msg;
    }
    
    public UserEntity postUser(UserEntity user) {
    	if(user.getCart() == null) {
    		CartEntity cart = new CartEntity();
    		cart.setUser(user);
    		user.setCart(cart);
    	}
        return userRepository.save(user);
    }
    
    public void updateAddress(Long userId, AddressEntity addressEntity) {
        // Fetch user from the database
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        // Check if the user already has an address
        AddressEntity existingAddress = user.getAddress();

        if (existingAddress != null) {
            // Update the existing address
            existingAddress.setRegion(addressEntity.getRegion());
            existingAddress.setProvince(addressEntity.getProvince());
            existingAddress.setCity(addressEntity.getCity());
            existingAddress.setBarangay(addressEntity.getBarangay());
            existingAddress.setPostalCode(addressEntity.getPostalCode());
            existingAddress.setStreetBuildingHouseNo(addressEntity.getStreetBuildingHouseNo());
        } else {
            // Create a new address and associate it with the user
            addressEntity.setUser(user);
            user.setAddress(addressEntity);
        }

        // Save the user entity (the address will cascade if configured properly)
        userRepository.save(user);
    }
    
    public Optional<UserEntity> findUserById(Long id) {
    	return userRepository.findById(id);
    }

}