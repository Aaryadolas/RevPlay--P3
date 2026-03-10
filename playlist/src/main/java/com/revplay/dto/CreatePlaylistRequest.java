package com.revplay.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreatePlaylistRequest {

	@NotNull(message = "User ID is required")
	private Long userId;

	@NotBlank(message = "Playlist name is required")
	private String name;

	private String description;

	// PUBLIC or PRIVATE
	private String privacy = "PUBLIC";
}
