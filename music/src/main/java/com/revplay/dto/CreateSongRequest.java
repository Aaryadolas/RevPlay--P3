package com.revplay.dto;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateSongRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Artist ID is required")
    private Long artistId;

    private Long albumId;

    @NotBlank(message = "Genre is required")
    private String genre;

    private Integer duration;
    private String audioUrl;
    private String coverImage;
    private String releaseDate;

    // PUBLIC or UNLISTED
    private String visibility = "PUBLIC";
}
