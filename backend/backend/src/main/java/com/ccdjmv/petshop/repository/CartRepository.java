package com.ccdjmv.petshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ccdjmv.petshop.entity.CartEntity;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long>{
	
}