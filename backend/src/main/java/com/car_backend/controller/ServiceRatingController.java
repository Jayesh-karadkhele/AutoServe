package com.car_backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.car_backend.dto.CreateRatingDto;
import com.car_backend.dto.RatingOverviewDto;
import com.car_backend.dto.RatingResponseDto;
import com.car_backend.service.ServiceRatingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ratings")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class ServiceRatingController {

    private final ServiceRatingService ratingService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping
    public ResponseEntity<RatingResponseDto> createRating(@Valid @RequestBody CreateRatingDto dto) {
        return ResponseEntity.ok(ratingService.createRating(dto));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PutMapping("/{ratingId}")
    public ResponseEntity<RatingResponseDto> updateRating(
            @PathVariable("ratingId") Long ratingId,
            @Valid @RequestBody CreateRatingDto dto) {
        return ResponseEntity.ok(ratingService.updateRating(ratingId, dto));
    }

    @GetMapping("/job-card/{jobCardId}")
    public ResponseEntity<RatingResponseDto> getRatingByJobCard(@PathVariable("jobCardId") Long jobCardId) {
        return ResponseEntity.ok(ratingService.getRatingByJobCard(jobCardId));
    }

    @GetMapping("/mechanic/{mechanicId}")
    public ResponseEntity<Page<RatingResponseDto>> getRatingsForMechanic(
            @PathVariable("mechanicId") Long mechanicId,
            @PageableDefault(size = 10, sort = "createdOn", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ratingService.getRatingsForMechanic(mechanicId, pageable));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/me")
    public ResponseEntity<Page<RatingResponseDto>> getCustomerRatings(
            @PageableDefault(size = 10, sort = "createdOn", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ratingService.getCustomerRatings(pageable));
    }

    @GetMapping
    public ResponseEntity<Page<RatingResponseDto>> getAllRatings(
            @PageableDefault(size = 15, sort = "createdOn", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ratingService.getAllRatings(pageable));
    }

    @GetMapping("/overview")
    public ResponseEntity<RatingOverviewDto> getOverview() {
        return ResponseEntity.ok(ratingService.getOverview());
    }

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> deleteRating(@PathVariable("ratingId") Long ratingId) {
        ratingService.deleteRating(ratingId);
        return ResponseEntity.noContent().build();
    }
}
