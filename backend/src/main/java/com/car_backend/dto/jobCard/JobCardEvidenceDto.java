package com.car_backend.dto.jobCard;

import java.time.LocalDateTime;

import com.car_backend.entities.EvidenceType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobCardEvidenceDto {
	private Long id;
	private String photoUrl;
	private String description;
	private LocalDateTime uploadedAt;
	private EvidenceType evidenceType;
	private String mediaType;
	private String originalFilename;
	private Long uploaderId;
	private String uploaderName;
}
