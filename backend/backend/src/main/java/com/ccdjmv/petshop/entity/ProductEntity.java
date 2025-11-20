package com.ccdjmv.petshop.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

@Entity
@Table(name="tblproduct")
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ProductID;
    
    private String description;
    private double productPrice;
    private String productName;
    private String productType;
    private int quantity;
    private int quantitySold;
    
    @Column(columnDefinition = "LONGTEXT")
    private String productImage;
    
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "product", cascade = CascadeType.ALL)
    @JsonManagedReference("product-productreview")
    private List<ProductReviewEntity> productreview;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<CartItemEntity> cartItems;
    
    // Constructors
    public ProductEntity() {
    	super();
    	this.quantitySold = 0;
    }

	public ProductEntity(int productID, String description, double productPrice, String productName, String productType,
			int quantity, int quantitySold, String productImage, List<ProductReviewEntity> productreview,
			List<CartItemEntity> cartItems) {
		super();
		ProductID = productID;
		this.description = description;
		this.productPrice = productPrice;
		this.productName = productName;
		this.productType = productType;
		this.quantity = quantity;
		this.quantitySold = quantitySold;
		this.productImage = productImage;
		this.productreview = productreview;
		this.cartItems = cartItems;
	}

	public int getProductID() {
		return ProductID;
	}

	public void setProductID(int productID) {
		ProductID = productID;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public double getProductPrice() {
		return productPrice;
	}

	public void setProductPrice(double productPrice) {
		this.productPrice = productPrice;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getProductType() {
		return productType;
	}

	public void setProductType(String productType) {
		this.productType = productType;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public int getQuantitySold() {
		return quantitySold;
	}

	public void setQuantitySold(int quantitySold) {
		this.quantitySold = quantitySold;
	}

	public String getProductImage() {
		return productImage;
	}

	public void setProductImage(String productImage) {
		this.productImage = productImage;
	}

	public List<ProductReviewEntity> getProductreview() {
		return productreview;
	}

	public void setProductreview(List<ProductReviewEntity> productreview) {
		this.productreview = productreview;
	}

	public List<CartItemEntity> getCartItems() {
		return cartItems;
	}

	public void setCartItems(List<CartItemEntity> cartItems) {
		this.cartItems = cartItems;
	}

	
}
