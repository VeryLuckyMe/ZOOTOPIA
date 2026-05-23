package com.zootopia.petshop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zootopia.petshop.entity.PetEntity;
import com.zootopia.petshop.entity.UserEntity;

public interface PetRepository extends JpaRepository<PetEntity, Long> {
    
    // Custom method to find pets by user
    List<PetEntity> findByUser(UserEntity user);
    
    // Custom method to find pets by user ID
    List<PetEntity> findByUserId(Long userId);
}
