package com.car_backend.service;

import com.car_backend.dto.mechanic.MechanicOverviewDto;

public interface MechanicService {
    MechanicOverviewDto getMechanicOverview(Long mechanicId);
}
