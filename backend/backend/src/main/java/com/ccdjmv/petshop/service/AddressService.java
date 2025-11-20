package com.ccdjmv.petshop.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ccdjmv.petshop.entity.AddressEntity;
import com.ccdjmv.petshop.entity.UserEntity;
import com.ccdjmv.petshop.repository.AddressRepository;
import com.ccdjmv.petshop.repository.UserRepository;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    // Add or update the address for a user
    public AddressEntity addOrUpdateAddressForUser(Long userId, AddressEntity address) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // If user already has an address, update it
        AddressEntity existingAddress = user.getAddress();
        if (existingAddress != null) {
            existingAddress.setRegion(address.getRegion());
            existingAddress.setProvince(address.getProvince());
            existingAddress.setCity(address.getCity());
            existingAddress.setBarangay(address.getBarangay());
            existingAddress.setPostalCode(address.getPostalCode());
            existingAddress.setStreetBuildingHouseNo(address.getStreetBuildingHouseNo());
            return addressRepository.save(existingAddress);
        }

        // Otherwise, create a new address and associate it with the user
        address.setUser(user);
        user.setAddress(address);
        userRepository.save(user); // Cascade ensures address is saved
        return address;
    }

    // Get the address for a user
    public AddressEntity getAddressByUserId(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return user.getAddress();
    }

    // Delete the address for a user
    public void deleteAddressForUser(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        AddressEntity address = user.getAddress();
        if (address != null) {
            user.setAddress(null); // Unlink the address from the user
            userRepository.save(user); // Save changes to the user
            addressRepository.delete(address); // Delete the address
        }
    }
    
    // Get all addresses from every user
    public List<AddressEntity> getAllAddress() {
    	return addressRepository.findAll();
    }
}

