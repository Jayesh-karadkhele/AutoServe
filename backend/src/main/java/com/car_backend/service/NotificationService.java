package com.car_backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.car_backend.dto.NotificationResponseDto;
import com.car_backend.entities.User;

public interface NotificationService {

    Page<NotificationResponseDto> getNotificationsForCurrentUser(Pageable pageable);

    long getUnreadCountForCurrentUser();

    void markAsRead(Long notificationId);

    void markAllAsReadForCurrentUser();

    void createNotification(User recipient, String title, String message, String resourceType, Long resourceId, String navigationLink);
}
