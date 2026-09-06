package com.car_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.car_backend.entities.Appointment;
import com.car_backend.entities.Status;

import jakarta.persistence.LockModeType;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

	List<Appointment> findByVehicleDetails_Customer_Id(Long customerId);

	List<Appointment> findByVehicleDetails_Id(Long vehicleId);

	List<Appointment> findByStatus(Status status);

	long countByStatus(Status status);

	long countByManagerIsNull();

	long countByManagerId(Long managerId);

	long countByManager_Id(Long managerId);

	@Query("SELECT COUNT(*) FROM Appointment WHERE status='PENDING'")
	Long countPendingAppointments();

	List<Appointment> findByRsaTrue();

	List<Appointment> findByRsaTrueAndStatus(Status status);

	@Query("SELECT COUNT(*) FROM Appointment WHERE rsa=true")
	Long countRsaAppointment();

	List<Appointment> findByMechanic_Id(Long mechanicId);

	List<Appointment> findByManager_Id(Long managerId);

	boolean existsByIdAndVehicleDetails_Customer_Id(Long id, Long customerId);

	boolean existsByIdAndManager_Id(Long id, Long managerId);

	boolean existsByIdAndMechanic_Id(Long id, Long mechanicId);

	List<Appointment> findByStatusAndManagerIsNull(Status status);

	Page<Appointment> findByStatusAndManagerIsNull(Status status, Pageable pageable);

	long countByStatusAndManagerIsNull(Status status);

	boolean existsByIdAndStatusAndManagerIsNull(Long id, Status status);

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT a FROM Appointment a WHERE a.id = :id")
	Optional<Appointment> findByIdWithLock(@Param("id") Long id);
}
