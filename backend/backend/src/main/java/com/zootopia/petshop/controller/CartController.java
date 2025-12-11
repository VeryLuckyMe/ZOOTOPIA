package com.zootopia.petshop.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zootopia.petshop.entity.CartEntity;
import com.zootopia.petshop.entity.CartEntity.CartItem;
import com.zootopia.petshop.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private static final Logger logger = LoggerFactory.getLogger(CartController.class);

    @Autowired
    private CartService cartServ;

    @GetMapping("/test")
    public String test() {
        return "Test endpoint is working!";
    }

    // Create of CRUD
    @PostMapping("/postCartRecord")
    public CartEntity postCartRecord(@RequestBody CartEntity cart) {
        return cartServ.postCartRecord(cart);
    }

    // Read of CRUD
    @GetMapping("/getAllCarts")
    public List<CartEntity> getAllCarts(){
        return cartServ.getAllCarts();
    }

    @GetMapping("/getCartById/{cartId}")
    public CartEntity getCartById(@PathVariable Long cartId) {
        return cartServ.getCartById(cartId);
    }

    // Update of CRUD
    @PutMapping("/putCartDetails")
    public CartEntity putCartDetails(@RequestParam Long cartId, @RequestBody CartEntity newCartDetails) {
        return cartServ.putCartDetails(cartId, newCartDetails);
    }

    // Delete of CRUD
    @DeleteMapping("/deleteCartDetails/{cartId}")
    public String deleteCart(@PathVariable Long cartId) {
        return cartServ.deleteCart(cartId);
    }

    // Compatibility endpoint: accept userId as request param when path cartId is not provided
    @PostMapping("/items")
    public ResponseEntity<?> addItemToCartDirect(@RequestParam Long userId, @RequestParam Long productId, @RequestParam int quantity) {
        logger.info("Received addItemToCartDirect request: userId={}, productId={}, quantity={}", userId, productId, quantity);
        try {
            CartEntity result = cartServ.addItemToCart(userId, productId, quantity);
            logger.info("addItemToCartDirect succeeded: userId={}, productId={}, quantity={}", userId, productId, quantity);
            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            logger.error("Failed to add item to cart (direct). userId={}, productId={}, qty={}, err={}", userId, productId, quantity, ex.toString());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product or cart not found: " + ex.getMessage());
        }
    }

    // Cart-item endpoints (migrated from CartItemController)
    @PostMapping("/{cartId}/items")
    public ResponseEntity<?> addItemToCart(@PathVariable Long cartId, @RequestParam Long productId, @RequestParam int quantity) {
        logger.info("Received addItemToCart request: cartId={}, productId={}, quantity={}", cartId, productId, quantity);
        try {
            CartEntity result = cartServ.addItemToCart(cartId, productId, quantity);
            logger.info("addItemToCart succeeded: cartId={}, productId={}, quantity={}", cartId, productId, quantity);
            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            logger.error("Failed to add item to cart. cartId={}, productId={}, qty={}, err={}", cartId, productId, quantity, ex.toString());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product or cart not found: " + ex.getMessage());
        }
    }

    @GetMapping("/{cartId}/items")
    public List<CartItem> getCartItems(@PathVariable Long cartId) {
        return cartServ.getCartItems(cartId);
    }

    @PutMapping("/{cartId}/items")
    public CartEntity updateItemInCart(@PathVariable Long cartId, @RequestParam Long productId, @RequestParam int quantity) {
        return cartServ.updateItemInCart(cartId, productId, quantity);
    }

    @DeleteMapping("/{cartId}/items")
    public String deleteItemFromCart(@PathVariable Long cartId, @RequestParam Long productId) {
        return cartServ.deleteItemFromCart(cartId, productId);
    }
}
