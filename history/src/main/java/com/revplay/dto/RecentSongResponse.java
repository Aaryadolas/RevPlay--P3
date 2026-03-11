package com.revplay.dto;


import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecentSongResponse {
    private Long songId;
    private LocalDateTime lastPlayedAt;
    private Integer totalPlays;
}