package com.car_backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.car_backend.entities.Status;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AppointmentResponseDto {
	private Long id;

	private Long vehicleId;
	private String licensePlate;
	private String brand;
	private String model;
	private String color;

	private Long customerId;
	private String customerName;
	private String email;
	private String mobile;

	private LocalDate requestDate;
	private String problemDescription;
	private String customerPhotoUrl;
	private String vehicleImageUrl;

	private boolean isRsa;
	private String rsaCoordinates;
	private RsaLocationDto rsaLocation;

	private Status status;
	private String rejectionReason;

	private Long managerId;
	private String managerName;

	private Long mechanicId;
	private String mechanicName;

	private com.car_backend.entities.ServiceFulfilmentMode fulfilmentMode;
	private String pickupAddress;
	private String logisticsInstructions;

	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	@com.fasterxml.jackson.annotation.JsonProperty("preferredDate")
	public LocalDate getPreferredDate() {
		return requestDate;
	}

	@com.fasterxml.jackson.annotation.JsonProperty("serviceType")
	public String getServiceType() {
		return problemDescription;
	}

	@com.fasterxml.jackson.annotation.JsonProperty("vehicleRegistration")
	public String getVehicleRegistration() {
		return licensePlate;
	}

	@com.fasterxml.jackson.annotation.JsonProperty("vehicleMakeModel")
	public String getVehicleMakeModel() {
		return (brand != null ? brand : "") + (model != null ? " " + model : "");
	}
}
