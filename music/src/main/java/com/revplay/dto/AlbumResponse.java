package com.revplay.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AlbumResponse {
	private Long id;
	private Long artistId;
	private String albumName;
	private String description;
	private String coverImage;
	private LocalDate releaseDate;
	private List<SongResponse> songs;
	private LocalDateTime createdAt;
}
