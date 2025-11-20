package com.ccdjmv.petshop.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "admin")
public class AdminEntity {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long adminId;
	
	private String user;
	private String password;
	private String role;
	
	public AdminEntity(String user, String password,String role) {
		super();
		this.user = user;
		this.password = password;
		this.role = role;
	
	}
	
	public AdminEntity() {
		
	}
	
	public String getRole() {
		return role;
	}
	
	public void setRole(String role) {
		this.role = role;
	}

	public Long getAdminId() {
		return adminId;
	}

	public void setAdminId(Long adminId) {
		this.adminId = adminId;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	
	
	
}
