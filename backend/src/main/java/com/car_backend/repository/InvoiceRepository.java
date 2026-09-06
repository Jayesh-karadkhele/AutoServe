package com.car_backend.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.car_backend.entities.Invoice;
import com.car_backend.entities.PaymentStatus;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
	boolean existsByJobCardId(Long jobCardId);

	boolean existsByInvoiceNumber(String invoiceNumber);

	Invoice findByInvoiceNumber(String invoiceNumber);

	Optional<Invoice> findByJobCardId(Long jobCardId);

	@Query("SELECT i FROM Invoice i WHERE i.jobCard.appointment.vehicleDetails.customer.id = :customerId")
	List<Invoice> findByCustomerId(@Param("customerId") Long customerId);

	List<Invoice> findByPaymentStatus(PaymentStatus paymentStatus);

	long countByPaymentStatus(PaymentStatus paymentStatus);

	@Query("SELECT SUM(i.totalAmount) FROM Invoice i WHERE i.jobCard.manager.id = :managerId AND i.paymentStatus = com.car_backend.entities.PaymentStatus.PAID")
	BigDecimal calculateRevenueByManagerId(@Param("managerId") Long managerId);

	boolean existsByIdAndJobCard_Appointment_VehicleDetails_Customer_Id(Long id, Long customerId);

	boolean existsByIdAndJobCard_Manager_Id(Long id, Long managerId);

	List<Invoice> findByJobCard_Manager_Id(Long managerId);
}
