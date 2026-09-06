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

	@com.fasterxml.jackson.annotation.JsonProperty("id")
	public Long getId() {
		return VehicleId;
	}

	@com.fasterxml.jackson.annotation.JsonProperty("registrationNumber")
	public String getRegistrationNumber() {
		return licensePlate;
	}

	@com.fasterxml.jackson.annotation.JsonProperty("make")
	public String getMake() {
		return brand;
	}

	@com.fasterxml.jackson.annotation.JsonProperty("year")
	public Integer getYear() {
		return manufacturingYear;
	}
}
