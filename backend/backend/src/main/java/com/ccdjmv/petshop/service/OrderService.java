package com.ccdjmv.petshop.service;

import com.ccdjmv.petshop.entity.OrderEntity;
import com.ccdjmv.petshop.entity.OrderItemEntity;
import com.ccdjmv.petshop.entity.ProductEntity;
import com.ccdjmv.petshop.repository.OrderRepository;
import com.ccdjmv.petshop.repository.ProductRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.naming.NameNotFoundException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    OrderRepository orepo;
    
    @Autowired
    ProductRepository productRepository;

    public OrderService() {
        super();
    }

    @Transactional
    public OrderEntity postOrderRecord(OrderEntity order) {
        // Loop through each OrderItemEntity in the order
        for (OrderItemEntity orderItem : order.getOrderItems()) {
            // Find the corresponding product for the order item
        	Optional<ProductEntity> optionalProduct = productRepository.findById(Integer.parseInt(orderItem.getProductId()));
        	if (optionalProduct.isPresent()) {
        	    ProductEntity product = optionalProduct.get();
        	    product.setQuantity(product.getQuantity() - orderItem.getQuantity());
        	    product.setQuantitySold(product.getQuantitySold() + orderItem.getQuantity());
        	    productRepository.save(product);
        	} else {
        	    throw new RuntimeException("Product not found with ID: " + orderItem.getProductId());
        	}

        }

        // Save the order
        return orepo.save(order); // Save the order after handling the product updates
    }

    public OrderService(OrderRepository orderRepository) {
        this.orepo = orderRepository;
    }

    public OrderEntity getOrderDetails(int orderID) {
        return orepo.findById(orderID)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<OrderEntity> getAllOrdersByUserId(int userId) {
        return orepo.findByUserId(userId);
    }

    public List<OrderEntity> getAllOrder() {
        return orepo.findAll();
    }

    @SuppressWarnings("finally")
    public OrderEntity putOrderDetails(int id, OrderEntity newOrderDetails) {
        OrderEntity order = new OrderEntity();

        try {
            order = orepo.findById(id).get();

            order.setOrderDate(newOrderDetails.getOrderDate());
            order.setPaymentMethod(newOrderDetails.getPaymentMethod());
            order.setPaymentStatus(newOrderDetails.getPaymentStatus());
            order.setOrderStatus(newOrderDetails.getOrderStatus());
            order.setTotalPrice(newOrderDetails.getTotalPrice());
            order.setUser(newOrderDetails.getUser());
        } catch(NoSuchElementException nex) {
            throw new NameNotFoundException("Order " + id + " not found");
        } finally {
            return orepo.save(order);
        }
    }

    public String deleteOrder(int id) {
        String msg = "";
        if(orepo.findById(id).isPresent()) {
            orepo.deleteById(id);
            msg = "Order successfully deleted!";
        } else {
            msg = id +  " NOT found";
        }
        return msg;
    }
    
    public Double getTotalIncome() {
        // Call the repository method to get the sum of all totalPrice values
        return orepo.calculateTotalIncome();
    }
}
