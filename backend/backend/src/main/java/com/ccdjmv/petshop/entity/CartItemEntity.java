package com.ccdjmv.petshop.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity
public class CartItemEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int cartItemId;
	
	private int quantity;
	private LocalDateTime lastUpdated;
	
	@ManyToOne
	@JoinColumn(name = "cart_id", nullable = false)
	@JsonBackReference("cart-cartItem")
	private CartEntity cart;

	@ManyToOne
	@JoinColumn(name = "product_id", nullable = false)
	private ProductEntity product;

	public CartItemEntity() {
		super();
		this.lastUpdated = LocalDateTime.now(); //initialize lastUpdated upon creation
	}

	public CartItemEntity(int cartItemId, int quantity, CartEntity cart, ProductEntity product) {
		super();
		this.cartItemId = cartItemId;
		this.quantity = quantity;
		this.cart = cart;
		this.product = product;
	}

	public int getCartItemId() {
		return cartItemId;
	}

	public void setCartItemId(int cartItemId) {
		this.cartItemId = cartItemId;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public LocalDateTime getLastUpdated() {
		return lastUpdated;
	}

	public void setLastUpdated(LocalDateTime lastUpdated) {
		this.lastUpdated = lastUpdated;
	}

	public CartEntity getCart() {
		return cart;
	}

	public void setCart(CartEntity cart) {
		this.cart = cart;
	}

	public ProductEntity getProduct() {
		return product;
	}

	public void setProduct(ProductEntity product) {
		this.product = product;
	}
}
