package com.ccdjmv.petshop.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ccdjmv.petshop.entity.CartEntity;
import com.ccdjmv.petshop.repository.CartRepository;

@Service
public class CartService {
	@Autowired
	CartRepository cartRepo;

	public CartService() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	//Create of CRUD
	public CartEntity postCartRecord(CartEntity cart) {
		return cartRepo.save(cart);
	}
	
	//Read of CRUD 
	public List<CartEntity>getAllCarts(){
		return cartRepo.findAll();
	}
	
	public CartEntity getCartById(Long cartId) {
		Optional<CartEntity> cartOptional = cartRepo.findById(cartId);
        if (cartOptional.isPresent()) {
            return cartOptional.get();
        } else {
            // Handle case where cart is not found (throw an exception, return null, etc.)
            throw new RuntimeException("Cart not found for id: " + cartId);
        }
	}
	
	//Update of CRUD 
	//This function may have no use
	public CartEntity putCartDetails(Long cartId, CartEntity newCartDetails) {
	    try {
	        // Search for the cart by ID
	        CartEntity cart = cartRepo.findById(cartId).orElseThrow(() -> 
	            new NoSuchElementException("Cart " + cartId + " not found"));

	        // If ID found, set new values
	        //new values here

	        // Save the updated cart
	        return cartRepo.save(cart);
	    } catch (NoSuchElementException nex) {
	        throw nex; // Re-throw the exception
	        
	    }
	}
	
	//Delete of CRUD
	public String deleteCart(Long cartId) {
		String msg = "";
		if (cartRepo.findById(cartId).isPresent()) {
			cartRepo.deleteById(cartId);
			msg = "Cart Successfully deleted";
		}else {
			msg = cartId + " NOT found";
		}
		return msg;
	}

	// Cart-item operations (migrated from CartItemService)
	public CartEntity addItemToCart(Long cartId, Long productId, int quantity) {
		if (quantity <= 0) {
			throw new IllegalArgumentException("Quantity must be greater than 0");
		}
		CartEntity cart = cartRepo.findById(cartId).orElseThrow(() ->
				new NoSuchElementException("Cart " + cartId + " not found"));

		List<CartEntity.CartItem> items = cart.getCartItems();
		if (items == null) {
			items = new ArrayList<>();
		}

		CartEntity.CartItem found = null;
		for (CartEntity.CartItem ci : items) {
			if (productId.equals(ci.getProductId())) {
				found = ci;
				break;
			}
		}
		if (found != null) {
			found.setQuantity(found.getQuantity() + quantity);
			found.setLastUpdated(LocalDateTime.now());
		} else {
			items.add(new CartEntity.CartItem(productId, quantity));
		}
		cart.setCartItems(items);
		return cartRepo.save(cart);
	}

	public List<CartEntity.CartItem> getCartItems(Long cartId) {
		CartEntity cart = cartRepo.findById(cartId).orElseThrow(() ->
				new NoSuchElementException("Cart " + cartId + " not found"));
		return cart.getCartItems();
	}

	public CartEntity updateItemInCart(Long cartId, Long productId, int quantity) {
		try {
			CartEntity cart = cartRepo.findById(cartId).orElseThrow(() ->
					new NoSuchElementException("Cart " + cartId + " not found"));
			List<CartEntity.CartItem> items = cart.getCartItems();
			if (items == null) items = new ArrayList<>();
			CartEntity.CartItem found = null;
			for (CartEntity.CartItem ci : items) {
				if (productId.equals(ci.getProductId())) {
					found = ci;
					break;
				}
			}
			if (found == null) {
				throw new NoSuchElementException("CartItem for product " + productId + " not found");
			}
			found.setQuantity(quantity);
			found.setLastUpdated(LocalDateTime.now());
			cart.setCartItems(items);
			return cartRepo.save(cart);
		} catch (NoSuchElementException nex) {
			throw nex;
		}
	}

	public String deleteItemFromCart(Long cartId, Long productId) {
		CartEntity cart = cartRepo.findById(cartId).orElseThrow(() ->
				new NoSuchElementException("Cart " + cartId + " not found"));
		List<CartEntity.CartItem> items = cart.getCartItems();
		if (items == null || items.isEmpty()) {
			return "No items in cart";
		}
		boolean removed = items.removeIf(ci -> productId.equals(ci.getProductId()));
		if (removed) {
			cart.setCartItems(items);
			cartRepo.save(cart);
			return "CartItem removed";
		} else {
			return "CartItem not found";
		}
	}
}