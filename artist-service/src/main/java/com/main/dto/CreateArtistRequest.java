package com.main.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateArtistRequest {

 
    private Long userId;

    @NotBlank(message = "Artist name is required")
    private String artistName;

    private String bio;
    private String genre;
    private String profilePicture;
    private String bannerImage;
}
