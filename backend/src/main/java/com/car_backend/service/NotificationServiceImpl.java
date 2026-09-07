package com.car_backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.dto.NotificationResponseDto;
import com.car_backend.entities.Notification;
import com.car_backend.entities.User;
import com.car_backend.exceptions.ResourceNotFoundException;
import com.car_backend.exceptions.UnauthorizedException;
import com.car_backend.repository.NotificationRepository;
import com.car_backend.security.service.CurrentUserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final CurrentUserService currentUserService;

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponseDto> getNotificationsForCurrentUser(Pageable pageable) {
        Long userId = currentUserService.getUserId();
        Page<Notification> notifications = notificationRepository.findByRecipient_IdOrderByCreatedOnDesc(userId, pageable);
        return notifications.map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCountForCurrentUser() {
        Long userId = currentUserService.getUserId();
        return notificationRepository.countByRecipient_IdAndReadFalse(userId);
    }

    @Override
    public void markAsRead(Long notificationId) {
        Long userId = currentUserService.getUserId();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getRecipient().getId().equals(userId)) {
            throw new UnauthorizedException("Access denied to notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsReadForCurrentUser() {
        Long userId = currentUserService.getUserId();
        notificationRepository.markAllAsReadForUser(userId);
    }

    @Override
    public void createNotification(User recipient, String title, String message, String resourceType, Long resourceId, String navigationLink) {
        if (recipient == null) {
            return;
        }

        Notification notification = Notification.builder()
                .recipient(recipient)
                .title(title)
                .message(message)
                .resourceType(resourceType)
                .resourceId(resourceId)
                .navigationLink(navigationLink)
                .read(false)
                .build();

        notificationRepository.save(notification);
        log.info("Created notification '{}' for user ID {}", title, recipient.getId());
    }

    private NotificationResponseDto mapToDto(Notification notification) {
        return NotificationResponseDto.builder()
                .id(notification.getId())
                .userId(notification.getRecipient().getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .resourceType(notification.getResourceType())
                .resourceId(notification.getResourceId())
                .navigationLink(notification.getNavigationLink())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedOn())
                .build();
    }
}
