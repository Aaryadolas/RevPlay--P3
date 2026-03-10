package com.revplay.dto;



import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddSongRequest {

    @NotNull(message = "Song ID is required")
    private Long songId;
}