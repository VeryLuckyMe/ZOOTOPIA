package com.ccdjmv.petshop.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ccdjmv.petshop.entity.AdminEntity;

public interface AdminRepository extends JpaRepository<AdminEntity,Long> {
	 Optional<AdminEntity> findByUserAndPassword(String user, String password);
}
