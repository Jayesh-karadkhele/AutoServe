package com.car_backend.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateAppointmentDto {

	@NotNull(message = "Vehicle id cannot be null.")
	private Long vehicleId;

	@NotNull(message = "Appointment date cannot be null.")
	@FutureOrPresent(message = "Appointment date must be in future or present.")
	@JsonAlias({"preferredDate", "requestDate"})
	private LocalDate requestDate;

	@NotBlank(message = "Description cannot be blank.")
	@Size(max = 500, message = "Description cannot be greater than 500.")
	@JsonAlias({"serviceType", "description", "problemDescription"})
	private String description;

	private boolean rsa;

	private String customerPhotoUrl;

	private String vehicleImageUrl;

	private String rsaCoordinates;

	private com.car_backend.entities.ServiceFulfilmentMode fulfilmentMode = com.car_backend.entities.ServiceFulfilmentMode.WORKSHOP_DROP_OFF;

	@Size(max = 500, message = "Pickup address cannot exceed 500 characters.")
	private String pickupAddress;

	@Size(max = 1000, message = "Logistics instructions cannot exceed 1000 characters.")
	private String logisticsInstructions;

	private String timeSlot;
	private String notes;

	public void setPreferredDate(Object prefDate) {
		if (this.requestDate == null && prefDate != null) {
			try {
				this.requestDate = LocalDate.parse(prefDate.toString());
			} catch (Exception ignored) {}
		}
	}

	public void setServiceType(String serviceType) {
		if (serviceType != null && !serviceType.isBlank()) {
			if (this.description == null || this.description.isBlank()) {
				this.description = serviceType;
			}
		}
	}

	public void setNotes(String notes) {
		this.notes = notes;
		if (notes != null && !notes.isBlank()) {
			if (this.description == null || this.description.isBlank()) {
				this.description = notes;
			} else if (!this.description.contains(notes)) {
				this.description = this.description + " (" + notes + ")";
			}
		}
	}

	@AssertTrue(message = "Pickup address is required when pickup and return is requested.")
	private boolean isPickupAddressValid() {
		if (com.car_backend.entities.ServiceFulfilmentMode.PICKUP_AND_RETURN_REQUESTED.equals(fulfilmentMode)) {
			return pickupAddress != null && !pickupAddress.trim().isEmpty();
		}
		return true;
	}

	@AssertTrue(message = "RSA coordinates are required for roadside assistance")
	private boolean isDataValid() {
		if (Boolean.TRUE.equals(rsa)) {
			return rsaCoordinates != null && !rsaCoordinates.trim().isEmpty();
		}
		return true;
	}

}
