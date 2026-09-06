package com.car_backend.dto.jobCard;

import com.car_backend.entities.EvidenceType;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AddEvidenceDto {
	
	@NotNull(message="photo url is required.")
	private String photoUrl;
	
	@Size(max=200, message="description cannot exceed 200 words.")
	private String description;

	private EvidenceType evidenceType;
	private String mediaType;
	private String originalFilename;
}
