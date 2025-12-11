package com.zootopia.petshop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zootopia.petshop.entity.AddressEntity;

public interface AddressRepository extends JpaRepository<AddressEntity, Long> {
    
    // Custom method to find addresses by userId
    AddressEntity findByUserId(Long userId);
}
