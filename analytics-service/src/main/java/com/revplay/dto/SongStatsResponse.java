package com.revplay.dto;


import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SongStatsResponse {
    private Long songId;
    private Long artistId;
    private Long totalPlays;
    private Long totalFavorites;
}
