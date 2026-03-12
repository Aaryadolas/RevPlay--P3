package com.revplay.dto;



import lombok.*;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ArtistDashboardResponse {
    private Long artistId;
    private Long totalSongs;
    private Long totalPlays;
    private Long totalFavorites;
    private List<SongStatsResponse> songStats;
    private List<TopSongResponse> topSongs;
}