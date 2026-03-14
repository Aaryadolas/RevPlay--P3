package com.revplay.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateAlbumRequest {

    // No @NotNull - comes from token
    private Long artistId;

    @NotBlank(message = "Album name is required")
    private String albumName;

    private String description;
    private String coverImage;
    private String releaseDate;
}
