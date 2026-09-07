package com.car_backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.car_backend.dto.CreateRoadsideRequestDto;
import com.car_backend.dto.RoadsideResponseDto;
import com.car_backend.dto.UpdateRoadsideStatusDto;

public interface RoadsideAssistanceService {

    RoadsideResponseDto createRequest(CreateRoadsideRequestDto dto);

    Page<RoadsideResponseDto> getCustomerRequests(Pageable pageable);

    Page<RoadsideResponseDto> getAllRequests(Pageable pageable);

    RoadsideResponseDto getRequestById(Long requestId);

    RoadsideResponseDto updateStatus(Long requestId, UpdateRoadsideStatusDto dto);

    void cancelRequest(Long requestId);
}
