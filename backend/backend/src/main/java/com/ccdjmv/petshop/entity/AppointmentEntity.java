package com.ccdjmv.petshop.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalTime;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;




@Entity
@Table(name = "tblappointments")
public class AppointmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer appId;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date date;
    private String email;       
    private String contactNo;    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime time;
    
    private boolean canceled = false; 
    private boolean confirmed;
    private String groomService;
    private String paymentMethod;
    private int price;
    
    @ManyToOne
    @JoinColumn(name = "id")
    @JsonBackReference
    private UserEntity user;
    
    public AppointmentEntity() {
    }
    
    public AppointmentEntity(Integer appId, Date date, String email, String contactNo, LocalTime time, 
    		boolean canceled, String groomService, String paymentMethod, int price, boolean confirmed ) {
    	super();
        this.appId = appId;
//        this.customerId = customerId;
        this.canceled = canceled;
        this.date = date;
        this.email = email;
        this.contactNo = contactNo;
        this.time = time;
        this.groomService = groomService;
        this.paymentMethod = paymentMethod;
        this.price = price;
        this.confirmed = confirmed;
    }
    
    public boolean isConfirmed() {
        return confirmed;
    }

    public void setConfirmed(boolean confirmed) {
        this.confirmed = confirmed;
    }
    public int getPrice() {
    	return price;
    }
    public void setPrice(int price) {
    	this.price = price;
    }
    public String getPaymentMethod() {
    	return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
    	this.paymentMethod = paymentMethod;
    }
    public String getGroomService() {
    	return groomService;
    }
    
    public void setGrommService(String groomService) {
    	this.groomService = groomService;
    }
    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }
    
    public boolean isCanceled() {
        return canceled;
    }

    public void setCanceled(boolean canceled) {
        this.canceled = canceled;
    }

    // Getters and Setters
    public Integer getAppId() {
        return appId;
    }
    
    public void setAppId(Integer appId) {
        this.appId = appId;
    }
      
    public Date getDate() {
        return date;
    }
    
    public void setDate(Date date) {
        this.date = date;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getContactNo() {
        return contactNo;
    }
    
    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }
    
    public UserEntity getUser() {
    	return user;
    }
    
    public void setUser(UserEntity user) {
    	this.user = user;
    }
    
}