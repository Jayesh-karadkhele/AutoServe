package com.car_backend.entities;

import java.time.LocalDate;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "appointments")
@AttributeOverride(name = "id", column = @Column(name = "appointment_id"))
@Getter
@Setter

public class Appointment extends BaseEntity {

	@Column(name = "request_date", nullable = false)
	private LocalDate requestDate;

	@Column(name = "problem_description")
	private String problemDescription;

	@Column(name = "is_rsa")
	private boolean rsa; // rsa = road side assistance

	@Column(name = "rsa_coordinates")
	private String rsaCoordinates;

	@Enumerated(EnumType.STRING)
	private Status status;

	@Column(name = "customer_photo_url")
	private String customerPhotoUrl;

	@Column(name = "vehicle_image_url")
	private String vehicleImageUrl;

	@Column(name = "rejection_reason")
	private String rejectionReason;

	@Enumerated(EnumType.STRING)
	@Column(name = "fulfilment_mode")
	private ServiceFulfilmentMode fulfilmentMode = ServiceFulfilmentMode.WORKSHOP_DROP_OFF;

	@Column(name = "pickup_address", length = 500)
	private String pickupAddress;

	@Column(name = "logistics_instructions", length = 1000)
	private String logisticsInstructions;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "vehicle_id", nullable = false)
	private Vehicle vehicleDetails;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "manager_id")
	private User manager;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "mechanic_id")
	private User mechanic;

}
