package com.ccdjmv.petshop.controller;

import com.ccdjmv.petshop.entity.OrderItemEntity;
import com.ccdjmv.petshop.repository.OrderItemRepository;
import com.ccdjmv.petshop.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(method = RequestMethod.GET, path="/api/orderItem")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderItemController {

    @Autowired
    OrderItemService oiserv;

    // CREATE
    @PostMapping("/postOrderItemRecord")
    public OrderItemEntity postOrderItemRecord(@RequestBody OrderItemEntity order) {
        return oiserv.postOrderItemRecord(order);
    }

    // READ
    @GetMapping("/getAllOrdersItem")
    public List<OrderItemEntity> getAllOrderItem() {
        return oiserv.getAllOrderItem();
    }

    // UPDATE
    @PutMapping("/putOrderItemDetails")
    public OrderItemEntity putOrderItemDetails(@RequestParam int id, @RequestBody OrderItemEntity newOrderItemDetails) {
        return oiserv.putOrderItemDetails(id, newOrderItemDetails);
    }

    // DELETE
    @DeleteMapping("/deleteOrderItemDetails/{id}")
    public String deleteOrderItem(@PathVariable int id) {
        return oiserv.deleteItemOrder(id);
    }
    
    // UPDATE
    @PutMapping("/updateIsRated/{id}")
    public OrderItemEntity updateIsRated(@PathVariable int id, @RequestBody OrderItemEntity newOrderItemDetails) {
        return oiserv.putOrderItemDetails(id, newOrderItemDetails);
    }
    
   
}
