package com.ccdjmv.petshop.controller;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ccdjmv.petshop.entity.ProductReviewEntity;
import com.ccdjmv.petshop.entity.ProductEntity;
import com.ccdjmv.petshop.entity.UserEntity;
import com.ccdjmv.petshop.repository.UserRepository;
import com.ccdjmv.petshop.repository.ProductRepository;
import com.ccdjmv.petshop.service.ProductReviewService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/review")
public class ProductReviewController {

    @Autowired
    private ProductReviewService reviewserv;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    private static final Logger logger = LoggerFactory.getLogger(ProductReviewController.class);

    @PostMapping("/postReview")
    public ResponseEntity<ProductReviewEntity> postProductReviewRecord(@RequestBody ProductReviewEntity review) {
        try {
            logger.info("Received review: {}", review);

            // Validate required fields
            if (review.getRatings() == 0 || review.getProduct() == null || review.getUser() == null) {
                logger.error("Invalid request data: {}", review);
                return ResponseEntity.badRequest().body(null);
            }

            // Fetch the user and product entities to ensure they exist
            Optional<UserEntity> userOpt = userRepository.findById(review.getUser().getId());
            Optional<ProductEntity> productOpt = productRepository.findById(review.getProduct().getProductID());

            if (userOpt.isEmpty() || productOpt.isEmpty()) {
                logger.error("User or product not found");
                return ResponseEntity.badRequest().body(null);
            }

            review.setUser(userOpt.get());
            review.setProduct(productOpt.get());

            ProductReviewEntity savedReview = reviewserv.postProductReviewRecord(review);
            return ResponseEntity.ok(savedReview);
        } catch (Exception e) {
            logger.error("Error posting review", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/getReview")
    public List<ProductReviewEntity> getAllReview() {
        return reviewserv.getAllReview();
    }

    @GetMapping("/getReview/{id}")
    public ResponseEntity<ProductReviewEntity> getReviewById(@PathVariable int id) {
        ProductReviewEntity review = reviewserv.getReviewById(id);
        return ResponseEntity.ok(review);
    }
    

    @PutMapping("/putReview/{id}")
    public ProductReviewEntity updateReview(@PathVariable int id, @RequestBody ProductReviewEntity reviewRecord) {
        return reviewserv.updateReview(id, reviewRecord);
    }

    @DeleteMapping("/deleteReview/{id}")
    public String deleteReview(@PathVariable int id) {
        return reviewserv.deleteReview(id);
    }
    
    @GetMapping("/getReviewsByProductId/{productId}")
    public List<ProductReviewEntity> getReviewsByProductId(@PathVariable int productId) {
        return reviewserv.getReviewsByProductId(productId);
    }
}
