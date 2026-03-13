package com.revplay.analyticsservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SongPlayRequest {

	@NotNull(message = "Song ID is required")
	private Long songId;

	@NotNull(message = "Artist ID is required")
	private Long artistId;

	@NotNull(message = "User ID is required")
	private Long userId;
}
