package com.main.dto;


import lombok.Data;

@Data
public class UpdateArtistRequest {
    private String artistName;
    private String bio;
    private String genre;
    private String profilePicture;
    private String bannerImage;
}
