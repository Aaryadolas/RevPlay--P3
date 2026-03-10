package com.revplay.dto;


import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlaylistResponse {
    private Long id;
    private Long userId;
    private String name;
    private String description;
    private String privacy;
    private Integer totalSongs;
    private List<PlaylistSongResponse> songs;
    private LocalDateTime createdAt;
}
