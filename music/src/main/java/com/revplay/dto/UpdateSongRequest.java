package com.revplay.dto;

import lombok.Data;

@Data
public class UpdateSongRequest {
    private String title;
    private String genre;
    private Integer duration;
    private String audioUrl;
    private String coverImage;
    private String releaseDate;
    private String visibility;
}
