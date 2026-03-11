package com.revplay.dto;


import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class HistoryRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Song ID is required")
    private Long songId;

    // how long user listened in seconds
    private Integer listenedDuration;
}
