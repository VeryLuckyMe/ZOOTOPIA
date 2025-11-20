package com.ccdjmv.petshop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ccdjmv.petshop.entity.CartEntity;
import com.ccdjmv.petshop.service.CartService;

@RestController
@RequestMapping(method = RequestMethod.GET, path="/api/cart")
public class CartController {
	
	@Autowired
	CartService cartServ;
	
	@GetMapping("/test")
    public String test() {
        return "Test endpoint is working!";
    }
	
	//Create of CRUD
	@PostMapping("/postCartRecord")
	public CartEntity postCartRecord(@RequestBody CartEntity cart) {
		return cartServ.postCartRecord(cart);
	}
		
	//Read of CRUD
	@GetMapping("/getAllCarts")
	public List<CartEntity> getAllCarts(){
		return cartServ.getAllCarts();
	}
	
	@GetMapping("/getCartById/{cartId}")
    public CartEntity getCartById(@PathVariable Long cartId) {
        return cartServ.getCartById(cartId);
    }
	
	//Update of CRUD
	//This function may have no use
	@PutMapping("/putCartDetails")
	public CartEntity putCartDetails(@RequestParam Long cartId, @RequestBody CartEntity newCartDetails) {
		return cartServ.putCartDetails(cartId, newCartDetails);
	}
	
	//Delete of CRUD
	@DeleteMapping("/deleteCartDetails/{cartId}")
	public String deleteCart(@PathVariable Long cartId) {
		return cartServ.deleteCart(cartId);
	}
}