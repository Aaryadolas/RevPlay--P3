package com.revplay.dto;



import lombok.Data;

@Data
public class UpdatePlaylistRequest {
    private String name;
    private String description;
    private String privacy;
}
