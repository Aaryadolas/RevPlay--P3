package com.main.dto;


import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ArtistResponse {
    private Long id;
    private Long userId;
    private String artistName;
    private String bio;
    private String genre;
    private String profilePicture;
    private String bannerImage;
    private SocialLinksResponse socialLinks;
    private LocalDateTime createdAt;
}
