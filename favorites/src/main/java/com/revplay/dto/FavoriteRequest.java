package com.revplay.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FavoriteRequest {

    // No @NotNull - comes from token
    private Long userId;

    @NotNull(message = "Song ID is required")
    private Long songId;
}