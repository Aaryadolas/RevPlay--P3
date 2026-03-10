package com.revplay.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SongResponse {
	private Long id;
	private String title;
	private Long artistId;
	private Long albumId;
	private String albumName;
	private String genre;
	private Integer duration;
	private String audioUrl;
	private String coverImage;
	private LocalDate releaseDate;
	private String visibility;
	private Long playCount;
	private LocalDateTime createdAt;
}
