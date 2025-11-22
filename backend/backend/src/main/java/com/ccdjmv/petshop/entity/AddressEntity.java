package com.ccdjmv.petshop.entity;

import org.springframework.web.bind.annotation.CrossOrigin;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@CrossOrigin(origins = "http://localhost:5173")
@Entity
@Table(name = "addresses")
public class AddressEntity {

    @Id
    private Long addressId;

    @Column(name = "region", nullable = false)
    private String region;

    @Column(name = "province", nullable = false)
    private String province;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "barangay", nullable = false)
    private String barangay;

    @Column(name = "postalCode", nullable = false)
    private String postalCode;

    @Column(name = "streetBuildingHouseNo", nullable = true)
    private String streetBuildingHouseNo;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference("user-address")
    private UserEntity user; // User that owns this address
    
    public AddressEntity() {
		super();
		// TODO Auto-generated constructor stub
	}

	public AddressEntity(Long addressId, String region, String province, String city, String barangay,
			String postalCode, String streetBuildingHouseNo, UserEntity user) {
		super();
		this.addressId = addressId;
		this.region = region;
		this.province = province;
		this.city = city;
		this.barangay = barangay;
		this.postalCode = postalCode;
		this.streetBuildingHouseNo = streetBuildingHouseNo;
		this.user = user;
	}

	public Long getAddressId() {
		return addressId;
	}

	public void setAddressId(Long addressId) {
		this.addressId = addressId;
	}

	public String getRegion() {
		return region;
	}

	public void setRegion(String region) {
		this.region = region;
	}

	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getBarangay() {
		return barangay;
	}

	public void setBarangay(String barangay) {
		this.barangay = barangay;
	}

	public String getPostalCode() {
		return postalCode;
	}

	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}

	public String getStreetBuildingHouseNo() {
		return streetBuildingHouseNo;
	}

	public void setStreetBuildingHouseNo(String streetBuildingHouseNo) {
		this.streetBuildingHouseNo = streetBuildingHouseNo;
	}

	public UserEntity getUser() {
		return user;
	}

	public void setUser(UserEntity user) {
		this.user = user;
	}

}
