package com.ccdjmv.petshop.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ccdjmv.petshop.entity.ProductEntity;
import com.ccdjmv.petshop.repository.ProductRepository;

@Service
public class ProductService {
    @Autowired
    
    ProductRepository prepo;
    
    public ProductEntity postProductRecord(ProductEntity product) {
        return prepo.save(product);
    }
    
    public List<ProductEntity> getAllProduct() {
        return prepo.findAll();
    }
    
    public ProductEntity getProductById(int productID) {
        return prepo.findById(productID).orElse(null);
    }

    
    public ProductEntity updateProduct(int id, ProductEntity productRecord) {
        ProductEntity existingProduct = prepo.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Product with id " + id + " not found."));
        
        existingProduct.setProductName(productRecord.getProductName());
        existingProduct.setProductPrice(productRecord.getProductPrice());
        existingProduct.setDescription(productRecord.getDescription());
        existingProduct.setProductType(productRecord.getProductType());
        existingProduct.setQuantity(productRecord.getQuantity());
        
        if (productRecord.getProductImage() != null) {
            existingProduct.setProductImage(productRecord.getProductImage());
        }
        
        return prepo.save(existingProduct);
    }
    
    public String deleteProduct(int id) {
        String msg;
        if (prepo.existsById(id)) {
            prepo.deleteById(id);
            msg = "Product record successfully deleted.";
        } else {
            msg = "Product with id " + id + " not found.";
        }
        return msg;
    }
    
    public int calculateTotalQuantitySold() {
        // Fetch all products
        List<ProductEntity> products = prepo.findAll();
        
        // Calculate total quantitySold
        int totalQuantitySold = 0;
        for (ProductEntity product : products) {
            totalQuantitySold += product.getQuantitySold();
        }

        return totalQuantitySold;
    }
}