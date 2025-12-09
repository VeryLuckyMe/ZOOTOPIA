package com.ccdjmv.petshop.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;

@Entity
public class CartEntity {
	@Id
	private Long cartId; //UserEntity PK is also cart PK
	
	@OneToOne
	@MapsId //For CartEntity to use same PK as user
	@JoinColumn(name = "user_id")
	@JsonBackReference("user-cart")
	private UserEntity user;
	
	@ElementCollection
	@CollectionTable(name = "cart_items", joinColumns = @JoinColumn(name = "cart_id"))
	private List<CartItem> cartItems;

	public CartEntity() {
		super();
		// TODO Auto-generated constructor stub
	}

	public CartEntity(Long cartId, List<CartItem> cartItem, UserEntity user) {
		super();
		this.cartId = cartId;
		this.cartItems = cartItem;
		this.user = user;
	}

	public Long getCartId() {
		return cartId;
	}

	public void setCartId(Long cartId) {
		this.cartId = cartId;
	}

	public UserEntity getUser() {
		return user;
	}

	public void setUser(UserEntity user) {
		this.user = user;
	}

	public List<CartItem> getCartItems() {
		return cartItems != null ? new ArrayList<CartItem>(cartItems) : new ArrayList<CartItem>();
	}
	public void setCartItems(List<CartItem> cartItems) {
		this.cartItems = cartItems;
	}

	@Embeddable
	public static class CartItem {
		private Long productId;
		private int quantity;
		private LocalDateTime lastUpdated;

		public CartItem() {
		}

		public CartItem(Long productId, int quantity) {
			this.productId = productId;
			this.quantity = quantity;
			this.lastUpdated = LocalDateTime.now();
		}

		public Long getProductId() {
			return productId;
		}

		public void setProductId(Long productId) {
			this.productId = productId;
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
	}

	
}
