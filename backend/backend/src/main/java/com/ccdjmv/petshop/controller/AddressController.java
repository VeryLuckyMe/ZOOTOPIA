package com.ccdjmv.petshop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ccdjmv.petshop.entity.AddressEntity;
import com.ccdjmv.petshop.service.AddressService;

@RestController
@RequestMapping("/addresses")
@CrossOrigin(origins = "http://localhost:5173")
public class AddressController {

    @Autowired
    private AddressService addressService;

    // Add or update an address for a user
    @PostMapping("/users/{userId}")
    public ResponseEntity<AddressEntity> addOrUpdateAddress(@PathVariable Long userId, @RequestBody AddressEntity address) {
        AddressEntity createdOrUpdatedAddress = addressService.addOrUpdateAddressForUser(userId, address);
        return new ResponseEntity<>(createdOrUpdatedAddress, HttpStatus.OK);
    }

    // Get the address for a user
    @GetMapping("/users/{userId}")
    public ResponseEntity<AddressEntity> getAddress(@PathVariable Long userId) {
        AddressEntity address = addressService.getAddressByUserId(userId);
        if (address != null) {
            return ResponseEntity.ok(address);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    // Get all addresses in the database regardless of user
    @GetMapping("/getAllAddress")
    public List<AddressEntity> getAllAddress(){
    	return addressService.getAllAddress();
    }

    // Delete the address for a user
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long userId) {
        addressService.deleteAddressForUser(userId);
        return ResponseEntity.noContent().build();
    }
}
