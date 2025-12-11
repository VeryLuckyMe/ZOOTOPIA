package com.zootopia.petshop.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zootopia.petshop.entity.ProductEntity;

public interface ProductRepository extends JpaRepository<ProductEntity,Integer>{

}
