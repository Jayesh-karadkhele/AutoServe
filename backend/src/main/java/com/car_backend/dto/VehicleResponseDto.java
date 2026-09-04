package com.car_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VehicleResponseDto {

	private Long VehicleId;
	private String licensePlate;
	private String brand;
	private String model;
	private String color;
	private String vehicleType;
	private Integer manufacturingYear;
	private String fuelType;
	private String lastServiceDate;
	private Integer totalServices;
	
	private boolean isActive;
	
	
	private Long CustomerId;
	private String customerName;
	private String customerEmail;
	private String customerMobile;
	
}
