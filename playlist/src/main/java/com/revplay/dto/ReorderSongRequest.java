package com.revplay.dto;


import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReorderSongRequest {

    @NotNull(message = "Song ID is required")
    private Long songId;

    @NotNull(message = "New position is required")
    private Integer newPosition;
}
