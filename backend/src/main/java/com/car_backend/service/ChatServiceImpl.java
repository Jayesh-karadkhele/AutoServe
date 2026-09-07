package com.car_backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.dto.ChatMessageDto;
import com.car_backend.dto.SendChatMessageDto;
import com.car_backend.entities.Chat;
import com.car_backend.entities.JobCard;
import com.car_backend.entities.Role;
import com.car_backend.entities.User;
import com.car_backend.exceptions.ResourceNotFoundException;
import com.car_backend.exceptions.UnauthorizedException;
import com.car_backend.repository.ChatRepository;
import com.car_backend.repository.JobCardRepository;
import com.car_backend.security.service.CurrentUserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;
    private final JobCardRepository jobCardRepository;
    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;

    @Override
    @Transactional(readOnly = true)
    public Page<ChatMessageDto> getMessagesForJobCard(Long jobCardId, Pageable pageable) {
        JobCard jobCard = validateAndGetParticipantJobCard(jobCardId);
        Page<Chat> messages = chatRepository.findByJobCard_IdOrderByCreatedOnDesc(jobCard.getId(), pageable);
        return messages.map(this::mapToDto);
    }

    @Override
    public ChatMessageDto sendMessage(Long jobCardId, SendChatMessageDto dto) {
        JobCard jobCard = validateAndGetParticipantJobCard(jobCardId);
        User sender = currentUserService.getAuthenticatedUser();

        Chat chat = new Chat();
        chat.setJobCard(jobCard);
        chat.setSender(sender);
        chat.setMessage(dto.getMessage().trim());
        chat.setRead(false);

        Chat saved = chatRepository.save(chat);
        log.info("User {} sent chat message on JobCard {}", sender.getId(), jobCardId);

        // Notify other participants
        notifyParticipants(jobCard, sender, dto.getMessage().trim());

        return mapToDto(saved);
    }

    @Override
    public void markMessagesAsRead(Long jobCardId) {
        JobCard jobCard = validateAndGetParticipantJobCard(jobCardId);
        Long userId = currentUserService.getUserId();
        chatRepository.markMessagesAsReadForJobCard(jobCard.getId(), userId);
    }

    private JobCard validateAndGetParticipantJobCard(Long jobCardId) {
        JobCard jobCard = jobCardRepository.findById(jobCardId)
                .orElseThrow(() -> new ResourceNotFoundException("Job card not found"));

        User user = currentUserService.getAuthenticatedUser();
        Role role = user.getUserRole();
        Long userId = user.getId();

        if (role == Role.ADMIN) {
            return jobCard;
        }

        if (role == Role.CUSTOMER) {
            Long customerId = jobCard.getAppointment().getVehicleDetails().getCustomer().getId();
            if (!customerId.equals(userId)) {
                throw new UnauthorizedException("You can only access chat for your own service appointments");
            }
            return jobCard;
        }

        if (role == Role.MECHANIC) {
            if (jobCard.getMechanic() == null || !jobCard.getMechanic().getId().equals(userId)) {
                throw new UnauthorizedException("You can only access chat for assigned jobs");
            }
            return jobCard;
        }

        if (role == Role.MANAGER) {
            User manager = jobCard.getAppointment().getManager();
            if (manager == null || !manager.getId().equals(userId)) {
                throw new UnauthorizedException("You can only access chat for jobs you manage");
            }
            return jobCard;
        }

        throw new UnauthorizedException("Access denied to chat");
    }

    private void notifyParticipants(JobCard jobCard, User sender, String messagePreview) {
        String title = "New message on JobCard #" + jobCard.getId();
        String snippet = messagePreview.length() > 50 ? messagePreview.substring(0, 47) + "..." : messagePreview;
        String message = sender.getUserName() + ": " + snippet;
        String link = "/job-cards/" + jobCard.getId();

        // Customer recipient
        User customer = jobCard.getAppointment().getVehicleDetails().getCustomer();
        if (customer != null && !customer.getId().equals(sender.getId())) {
            notificationService.createNotification(customer, title, message, "JOB_CARD", jobCard.getId(), link);
        }

        // Mechanic recipient
        User mechanic = jobCard.getMechanic();
        if (mechanic != null && !mechanic.getId().equals(sender.getId())) {
            notificationService.createNotification(mechanic, title, message, "JOB_CARD", jobCard.getId(), link);
        }

        // Manager recipient
        User manager = jobCard.getAppointment().getManager();
        if (manager != null && !manager.getId().equals(sender.getId())) {
            notificationService.createNotification(manager, title, message, "JOB_CARD", jobCard.getId(), link);
        }
    }

    private ChatMessageDto mapToDto(Chat chat) {
        User sender = chat.getSender();
        return ChatMessageDto.builder()
                .id(chat.getId())
                .jobCardId(chat.getJobCard().getId())
                .senderId(sender.getId())
                .senderName(sender.getUserName())
                .senderRole(sender.getUserRole().name())
                .message(chat.getMessage())
                .isRead(chat.isRead())
                .createdAt(chat.getCreatedOn())
                .build();
    }
}
