package com.car_backend.entities;

import java.time.LocalDateTime;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="job_card_evidence")
@AttributeOverride(name="id", column=@Column(name="evidence_id"))
@Getter
@Setter
public class JobCardEvidence extends BaseEntity{
	
	@Column(name="photo_url", nullable=false)
	private String photoUrl;
	
	
	private String description;
	
	@Column(name= "uploaded_at", nullable=false)
	private LocalDateTime uploadedAt;
	
	@Enumerated(EnumType.STRING)
	@Column(name="evidence_type")
	private EvidenceType evidenceType = EvidenceType.DURING_REPAIR;

	@Column(name="media_type")
	private String mediaType = "image/jpeg";

	@Column(name="original_filename")
	private String originalFilename;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="uploader_id")
	private User uploader;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="job_card_id", nullable=false)
	private JobCard jobCard;
}
