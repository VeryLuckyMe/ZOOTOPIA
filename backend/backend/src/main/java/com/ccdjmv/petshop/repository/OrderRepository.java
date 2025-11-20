package com.ccdjmv.petshop.repository;

import com.ccdjmv.petshop.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Integer> {
    List<OrderEntity> findByUserId(int userId);
    
    @Query("SELECT SUM(o.totalPrice) FROM OrderEntity o")
    Double calculateTotalIncome();

}
