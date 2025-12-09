package com.ccdjmv.petshop.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Deprecated controller. Cart-item endpoints have been migrated to `/api/cart/{cartId}/items`.
 */
@Deprecated
@RestController
@RequestMapping(path = "/api/cartItem")
public class CartItemController {
	@GetMapping("/test")
	public String test() {
		return "Deprecated: use /api/cart/{cartId}/items endpoints on CartController";
	}
}