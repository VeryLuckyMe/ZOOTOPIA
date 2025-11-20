package com.ccdjmv.petshop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ccdjmv.petshop.entity.ProductReviewEntity;

public interface ProductReviewRepository extends JpaRepository<ProductReviewEntity, Integer> {
	@Query("SELECT r FROM ProductReviewEntity r WHERE r.product.ProductID = :productId")
    List<ProductReviewEntity> findReviewsByProductId(@Param("productId") int productId);

}
