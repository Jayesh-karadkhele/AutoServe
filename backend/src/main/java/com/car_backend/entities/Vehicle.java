package com.car_backend.entities;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="vehicles")
@AttributeOverride(name="id", column=@Column(name="vehicle_id"))
@Getter
@Setter
public class Vehicle extends BaseEntity{
	@Column(name="license_plate", unique=true, nullable=false)
	private String licensePlate;
	
	private String brand;
	
	private String model;
	
	private String color;
	
	private String vehicleType;
	
	private Integer manufacturingYear;
	
	private String fuelType;
	
	private String lastServiceDate;
	
	private Integer totalServices = 0;
	
	private boolean isActive = true;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="customer_id", nullable=false)
	private User customer;
}
