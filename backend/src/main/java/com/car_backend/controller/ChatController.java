package com.car_backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.car_backend.dto.ChatMessageDto;
import com.car_backend.dto.SendChatMessageDto;
import com.car_backend.service.ChatService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/job-card/{jobCardId}")
    public ResponseEntity<Page<ChatMessageDto>> getMessagesForJobCard(
            @PathVariable("jobCardId") Long jobCardId,
            @PageableDefault(size = 30, sort = "createdOn", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(chatService.getMessagesForJobCard(jobCardId, pageable));
    }

    @PostMapping("/job-card/{jobCardId}")
    public ResponseEntity<ChatMessageDto> sendMessage(
            @PathVariable("jobCardId") Long jobCardId,
            @Valid @RequestBody SendChatMessageDto dto) {
        return ResponseEntity.ok(chatService.sendMessage(jobCardId, dto));
    }

    @PutMapping("/job-card/{jobCardId}/mark-read")
    public ResponseEntity<Void> markMessagesAsRead(@PathVariable("jobCardId") Long jobCardId) {
        chatService.markMessagesAsRead(jobCardId);
        return ResponseEntity.noContent().build();
    }
}
