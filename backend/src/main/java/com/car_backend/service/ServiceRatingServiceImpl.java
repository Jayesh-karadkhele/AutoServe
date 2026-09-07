package com.car_backend.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.dto.CreateRatingDto;
import com.car_backend.dto.RatingOverviewDto;
import com.car_backend.dto.RatingResponseDto;
import com.car_backend.entities.JobCard;
import com.car_backend.entities.JobCardStatus;
import com.car_backend.entities.Role;
import com.car_backend.entities.ServiceRating;
import com.car_backend.entities.User;
import com.car_backend.exceptions.InvalidOperationException;
import com.car_backend.exceptions.ResourceAlreadyExists;
import com.car_backend.exceptions.ResourceNotFoundException;
import com.car_backend.exceptions.UnauthorizedException;
import com.car_backend.repository.JobCardRepository;
import com.car_backend.repository.ServiceRatingRepository;
import com.car_backend.security.service.CurrentUserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ServiceRatingServiceImpl implements ServiceRatingService {

    private final ServiceRatingRepository ratingRepository;
    private final JobCardRepository jobCardRepository;
    private final CurrentUserService currentUserService;

    @Override
    public RatingResponseDto createRating(CreateRatingDto dto) {
        User customer = currentUserService.getAuthenticatedUser();

        JobCard jobCard = jobCardRepository.findById(dto.getJobCardId())
                .orElseThrow(() -> new ResourceNotFoundException("Job card not found"));

        if (!jobCard.getAppointment().getVehicleDetails().getCustomer().getId().equals(customer.getId())) {
            throw new UnauthorizedException("You can only submit reviews for your own completed services");
        }

        if (jobCard.getJobCardStatus() != JobCardStatus.COMPLETED) {
            throw new InvalidOperationException("Reviews can only be submitted for completed service job cards");
        }

        if (ratingRepository.existsByJobCard_Id(jobCard.getId())) {
            throw new ResourceAlreadyExists("A rating has already been submitted for this service");
        }

        ServiceRating rating = ServiceRating.builder()
                .jobCard(jobCard)
                .customer(customer)
                .mechanic(jobCard.getMechanic())
                .rating(dto.getRating())
                .comment(dto.getComment() != null ? dto.getComment().trim() : null)
                .build();

        ServiceRating saved = ratingRepository.save(rating);
        log.info("Rating {} created for JobCard {}", saved.getId(), jobCard.getId());
        return mapToDto(saved);
    }

    @Override
    public RatingResponseDto updateRating(Long ratingId, CreateRatingDto dto) {
        User customer = currentUserService.getAuthenticatedUser();

        ServiceRating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found"));

        if (!rating.getCustomer().getId().equals(customer.getId())) {
            throw new UnauthorizedException("You can only edit your own reviews");
        }

        rating.setRating(dto.getRating());
        if (dto.getComment() != null) {
            rating.setComment(dto.getComment().trim());
        }

        ServiceRating updated = ratingRepository.save(rating);
        return mapToDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public RatingResponseDto getRatingByJobCard(Long jobCardId) {
        ServiceRating rating = ratingRepository.findByJobCard_Id(jobCardId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found for job card"));
        return mapToDto(rating);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RatingResponseDto> getRatingsForMechanic(Long mechanicId, Pageable pageable) {
        return ratingRepository.findByMechanic_IdOrderByCreatedOnDesc(mechanicId, pageable).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RatingResponseDto> getCustomerRatings(Pageable pageable) {
        Long customerId = currentUserService.getUserId();
        return ratingRepository.findByCustomer_IdOrderByCreatedOnDesc(customerId, pageable).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RatingResponseDto> getAllRatings(Pageable pageable) {
        return ratingRepository.findAllByOrderByCreatedOnDesc(pageable).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public RatingOverviewDto getOverview() {
        List<ServiceRating> all = ratingRepository.findAll();
        long total = all.size();
        if (total == 0) {
            return RatingOverviewDto.builder()
                    .averageRating(0.0)
                    .totalReviews(0)
                    .fiveStarCount(0)
                    .fourStarCount(0)
                    .threeStarCount(0)
                    .twoStarCount(0)
                    .oneStarCount(0)
                    .build();
        }

        double sum = all.stream().mapToInt(ServiceRating::getRating).sum();
        double avg = Math.round((sum / total) * 10.0) / 10.0;

        return RatingOverviewDto.builder()
                .averageRating(avg)
                .totalReviews(total)
                .fiveStarCount(all.stream().filter(r -> r.getRating() == 5).count())
                .fourStarCount(all.stream().filter(r -> r.getRating() == 4).count())
                .threeStarCount(all.stream().filter(r -> r.getRating() == 3).count())
                .twoStarCount(all.stream().filter(r -> r.getRating() == 2).count())
                .oneStarCount(all.stream().filter(r -> r.getRating() == 1).count())
                .build();
    }

    @Override
    public void deleteRating(Long ratingId) {
        User user = currentUserService.getAuthenticatedUser();
        ServiceRating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found"));

        if (user.getUserRole() != Role.ADMIN && !rating.getCustomer().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied to delete rating");
        }

        ratingRepository.delete(rating);
    }

    private RatingResponseDto mapToDto(ServiceRating rating) {
        User customer = rating.getCustomer();
        User mechanic = rating.getMechanic();

        return RatingResponseDto.builder()
                .id(rating.getId())
                .jobCardId(rating.getJobCard().getId())
                .customerId(customer.getId())
                .customerName(customer.getUserName())
                .mechanicId(mechanic != null ? mechanic.getId() : null)
                .mechanicName(mechanic != null ? mechanic.getUserName() : null)
                .rating(rating.getRating())
                .comment(rating.getComment())
                .createdAt(rating.getCreatedOn())
                .build();
    }
}
