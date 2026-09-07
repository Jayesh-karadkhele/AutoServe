package com.car_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.car_backend.entities.ServiceRating;

public interface ServiceRatingRepository extends JpaRepository<ServiceRating, Long> {

    Optional<ServiceRating> findByJobCard_Id(Long jobCardId);

    boolean existsByJobCard_Id(Long jobCardId);

    Page<ServiceRating> findByMechanic_IdOrderByCreatedOnDesc(Long mechanicId, Pageable pageable);

    List<ServiceRating> findByMechanic_Id(Long mechanicId);

    Page<ServiceRating> findByCustomer_IdOrderByCreatedOnDesc(Long customerId, Pageable pageable);

    Page<ServiceRating> findAllByOrderByCreatedOnDesc(Pageable pageable);

    @Query("SELECT AVG(s.rating) FROM ServiceRating s")
    Double findAverageRating();

    @Query("SELECT AVG(s.rating) FROM ServiceRating s WHERE s.mechanic.id = :mechanicId")
    Double findAverageRatingForMechanic(@Param("mechanicId") Long mechanicId);
}
