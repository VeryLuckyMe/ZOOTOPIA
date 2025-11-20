package com.ccdjmv.petshop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ccdjmv.petshop.entity.AppointmentEntity;
@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Integer> {
//	@Query("SELECT a FROM AppointmentEntity a LEFT JOIN FETCH a.grooming g WHERE a.email = :email")
//	 List<AppointmentEntity> findByEmailWithGrooming(@Param("email") String email);

	List<AppointmentEntity> findByUserEmail(String email);
	 
	
}