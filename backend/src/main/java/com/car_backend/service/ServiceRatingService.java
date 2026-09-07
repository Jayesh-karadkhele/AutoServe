package com.car_backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.car_backend.dto.CreateRatingDto;
import com.car_backend.dto.RatingOverviewDto;
import com.car_backend.dto.RatingResponseDto;

public interface ServiceRatingService {

    RatingResponseDto createRating(CreateRatingDto dto);

    RatingResponseDto updateRating(Long ratingId, CreateRatingDto dto);

    RatingResponseDto getRatingByJobCard(Long jobCardId);

    Page<RatingResponseDto> getRatingsForMechanic(Long mechanicId, Pageable pageable);

    Page<RatingResponseDto> getCustomerRatings(Pageable pageable);

    Page<RatingResponseDto> getAllRatings(Pageable pageable);

    RatingOverviewDto getOverview();

    void deleteRating(Long ratingId);
}
