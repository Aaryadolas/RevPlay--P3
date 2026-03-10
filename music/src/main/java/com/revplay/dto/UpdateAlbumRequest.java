package com.revplay.dto;

import lombok.Data;

@Data
public class UpdateAlbumRequest {
	private String albumName;
	private String description;
	private String coverImage;
	private String releaseDate;
}
