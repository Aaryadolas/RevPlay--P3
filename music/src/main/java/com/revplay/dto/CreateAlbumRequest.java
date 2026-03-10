package com.revplay.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateAlbumRequest {

	@NotNull(message = "Artist ID is required")
	private Long artistId;

	@NotBlank(message = "Album name is required")
	private String albumName;

	private String description;
	private String coverImage;
	private String releaseDate;
}
