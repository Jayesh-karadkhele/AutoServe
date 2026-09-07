package com.car_backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.car_backend.dto.ChatMessageDto;
import com.car_backend.dto.SendChatMessageDto;

public interface ChatService {

    Page<ChatMessageDto> getMessagesForJobCard(Long jobCardId, Pageable pageable);

    ChatMessageDto sendMessage(Long jobCardId, SendChatMessageDto dto);

    void markMessagesAsRead(Long jobCardId);
}
