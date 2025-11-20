package com.ccdjmv.petshop.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
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
	
	@OneToMany(mappedBy = "cart", cascade = CascadeType.ALL)
	@JsonManagedReference("cart-cartItem")
	private List<CartItemEntity> cartItems;

	public CartEntity() {
		super();
		// TODO Auto-generated constructor stub
	}

	public CartEntity(Long cartId, List<CartItemEntity> cartItem, UserEntity user) {
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

	public List<CartItemEntity> getCartItems() {
		return cartItems;
	}

	public void setCartItems(List<CartItemEntity> cartItems) {
		this.cartItems = cartItems;
	}

	
}
