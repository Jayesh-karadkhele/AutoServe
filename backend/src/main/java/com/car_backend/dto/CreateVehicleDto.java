package com.car_backend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateVehicleDto {
	
	@NotBlank(message="Vehicle license plate is required.")
	@JsonAlias({"registrationNumber", "licensePlate"})
	private String licensePlate;
	
	@NotBlank(message="Vehicle brand is required.")
	@JsonAlias({"make", "brand"})
	private String brand;
	
	@NotBlank(message="Vehicle model is required.")
	private String model;
	
	private String color;
	
	private String vehicleType;
	
	@JsonAlias({"year", "manufacturingYear"})
	private Integer manufacturingYear;
	
	private String fuelType;
	private String lastServiceDate;
	private Integer totalServices;
	private String vin;
	
	private Long customerId;

	public String getColor() {
		return (color != null && !color.isBlank()) ? color : "WHITE";
	}

	public String getLicensePlate() {
		return licensePlate;
	}

	public void setLicensePlate(String licensePlate) {
		this.licensePlate = licensePlate;
	}

	public void setRegistrationNumber(String registrationNumber) {
		if (this.licensePlate == null || this.licensePlate.isBlank()) {
			this.licensePlate = registrationNumber;
		}
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public void setMake(String make) {
		if (this.brand == null || this.brand.isBlank()) {
			this.brand = make;
		}
	}

	public Integer getManufacturingYear() {
		return manufacturingYear;
	}

	public void setManufacturingYear(Integer manufacturingYear) {
		this.manufacturingYear = manufacturingYear;
	}

	public void setYear(Integer year) {
		if (this.manufacturingYear == null) {
			this.manufacturingYear = year;
		}
	}
}
