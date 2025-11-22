package com.ccdjmv.petshop.controller;

import com.ccdjmv.petshop.entity.OrderEntity;
import com.ccdjmv.petshop.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(method = RequestMethod.GET, path="/api/order")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    OrderService oserv;

    // CREATE
    @PostMapping("/postOrderRecord")
    public OrderEntity postOrderRecord(@RequestBody OrderEntity order) {
        return oserv.postOrderRecord(order);
    }

    // READ
    @GetMapping("/getAllOrders")
    public List<OrderEntity> getAllOrder() {
        return oserv.getAllOrder();
    }

    @GetMapping("/getOrderDetails/{orderID}")
    public ResponseEntity<OrderEntity> getOrderDetails(@PathVariable int orderID) {
        OrderEntity order = oserv.getOrderDetails(orderID);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/getAllOrdersByUserId")
    public List<OrderEntity> getAllOrdersByUserId(@RequestParam int userId) {
        return oserv.getAllOrdersByUserId(userId);
    }
    
    @GetMapping("/get-total-income")
    public Double getTotalIncome() {
        // Call the service method to get the total income
        return oserv.getTotalIncome();
    }
    // UPDATE
    @PutMapping("/putOrderDetails")
    public OrderEntity putOrderDetails(@RequestParam int id, @RequestBody OrderEntity newOrderDetails) {
        return oserv.putOrderDetails(id, newOrderDetails);
    }

    // DELETE
    @DeleteMapping("/deleteOrderDetails/{id}")
    public String deleteOrder(@PathVariable int id) {
        return oserv.deleteOrder(id);
    }
    
}
