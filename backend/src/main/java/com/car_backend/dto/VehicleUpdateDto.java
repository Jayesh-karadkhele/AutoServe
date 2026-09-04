package com.car_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VehicleUpdateDto {
	
	
	private String brand;
	

	private String model;
	

	private String color;
	private String vehicleType;
	private Integer manufacturingYear;
	private String fuelType;
	private String lastServiceDate;
	private Integer totalServices;
}
