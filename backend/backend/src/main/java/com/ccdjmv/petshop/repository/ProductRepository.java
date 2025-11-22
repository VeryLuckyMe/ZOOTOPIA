package com.ccdjmv.petshop.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ccdjmv.petshop.entity.ProductEntity;

public interface ProductRepository extends JpaRepository<ProductEntity,Integer>{

}
