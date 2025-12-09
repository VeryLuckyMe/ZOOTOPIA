package com.ccdjmv.petshop.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ccdjmv.petshop.entity.CartEntity;
import com.ccdjmv.petshop.repository.CartRepository;
import com.ccdjmv.petshop.repository.UserRepository;
import com.ccdjmv.petshop.repository.ProductRepository;
import com.ccdjmv.petshop.entity.UserEntity;
import com.ccdjmv.petshop.entity.ProductEntity;

@Service
public class CartService {
    private static final Logger logger = LoggerFactory.getLogger(CartService.class);
	@Autowired
	CartRepository cartRepo;

	@Autowired
	UserRepository userRepo;

	@Autowired
	ProductRepository productRepo;

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
        logger.debug("CartService.addItemToCart invoked: cartId={}, productId={}, quantity={}", cartId, productId, quantity);
		if (quantity <= 0) {
			throw new IllegalArgumentException("Quantity must be greater than 0");
		}
		// Ensure product exists
		ProductEntity product = null;
		try {
			Integer prodIdInt = productId != null ? productId.intValue() : null;
			if (prodIdInt == null || !productRepo.findById(prodIdInt).isPresent()) {
				throw new NoSuchElementException("Product " + productId + " not found");
			}
			product = productRepo.findById(prodIdInt).get();
		} catch (NumberFormatException nfe) {
			throw new NoSuchElementException("Product " + productId + " not found");
		}

		// Fetch or create cart. CartId is the same as user id (CartEntity uses @MapsId)
		CartEntity cart = cartRepo.findById(cartId).orElseGet(() -> {
			// Try to find the user and create a cart for them
			UserEntity user = userRepo.findById(cartId).orElse(null);
			if (user == null) {
				throw new NoSuchElementException("Cart " + cartId + " not found and no user to create cart");
			}
			CartEntity newCart = new CartEntity();
			newCart.setUser(user);
			// cartId will be set by MapsId relationship when saved
			return cartRepo.save(newCart);
		});

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
		CartEntity saved = cartRepo.save(cart);
		logger.debug("CartService.addItemToCart saved cartId={}", saved.getCartId());
		return saved;
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