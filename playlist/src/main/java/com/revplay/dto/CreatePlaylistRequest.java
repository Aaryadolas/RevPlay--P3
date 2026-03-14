package com.revplay.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreatePlaylistRequest {

    // No @NotNull - comes from token
    private Long userId;

    @NotBlank(message = "Playlist name is required")
    private String name;

    private String description;
    private String privacy = "PUBLIC";
} 