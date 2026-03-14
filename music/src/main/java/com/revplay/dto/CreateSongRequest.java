package com.revplay.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateSongRequest {

    @NotBlank(message = "Title is required")
    private String title;

    // No @NotNull - artistId comes from token
    private Long artistId;

    private Long albumId;

    @NotBlank(message = "Genre is required")
    private String genre;

    private Integer duration;
    private String audioUrl;
    private String coverImage;
    private String releaseDate;
    private String visibility = "PUBLIC";
}