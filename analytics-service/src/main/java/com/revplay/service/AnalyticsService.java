package com.revplay.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.revplay.client.FavoritesServiceClient;
import com.revplay.client.HistoryServiceClient;
import com.revplay.client.MusicServiceClient;
import com.revplay.dto.ArtistDashboardResponse;
import com.revplay.dto.SongPlayRequest;
import com.revplay.dto.SongPlayResponse;
import com.revplay.dto.SongStatsResponse;
import com.revplay.dto.TopSongResponse;
import com.revplay.dto.TrendResponse;
import com.revplay.entity.SongPlay;
import com.revplay.repository.SongPlayRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final SongPlayRepository songPlayRepository;
    private final MusicServiceClient musicServiceClient;
    private final FavoritesServiceClient favoritesServiceClient;
    private final HistoryServiceClient historyServiceClient;

    // Record a song play
    public SongPlayResponse recordPlay(SongPlayRequest request) {
        SongPlay songPlay = SongPlay.builder()
                .songId(request.getSongId())
                .artistId(request.getArtistId())
                .userId(request.getUserId())
                .build();

        SongPlay saved = songPlayRepository.save(songPlay);

        return SongPlayResponse.builder()
                .id(saved.getId())
                .songId(saved.getSongId())
                .artistId(saved.getArtistId())
                .userId(saved.getUserId())
                .playedAt(saved.getPlayedAt())
                .build();
    }

    // Get artist dashboard
    public ArtistDashboardResponse getArtistDashboard(
            Long artistId) {

        // total plays for artist
        Long totalPlays = songPlayRepository
                .countByArtistId(artistId);

        // total songs from music-service
        Long totalSongs = 0L;
        try {
            Object songs = musicServiceClient
                    .getSongsByArtist(artistId);
            if (songs instanceof List) {
                totalSongs = (long) ((List<?>) songs).size();
            }
        } catch (Exception e) {
            totalSongs = 0L;
        }

        // play count per song
        List<Object[]> playCountPerSong = songPlayRepository
                .findPlayCountPerSongByArtistId(artistId);

        // total favorites across all songs
        Long totalFavorites = 0L;
        List<SongStatsResponse> songStats = new ArrayList<>();

        for (Object[] row : playCountPerSong) {
            Long songId = (Long) row[0];
            Long plays  = (Long) row[1];

            Long favCount = 0L;
            try {
                Object favResponse = favoritesServiceClient
                        .getFavoriteCount(songId, null);
                if (favResponse instanceof Map) {
                    Object count = ((Map<?, ?>) favResponse)
                            .get("totalFavorites");
                    if (count instanceof Integer) {
                        favCount = ((Integer) count).longValue();
                    }
                }
            } catch (Exception e) {
                favCount = 0L;
            }

            totalFavorites += favCount;

            songStats.add(SongStatsResponse.builder()
                    .songId(songId)
                    .artistId(artistId)
                    .totalPlays(plays)
                    .totalFavorites(favCount)
                    .build());
        }

        // top songs
        List<Object[]> topSongsData = songPlayRepository
                .findTopSongsByArtistId(artistId);

        List<TopSongResponse> topSongs = topSongsData.stream()
                .limit(10)
                .map(row -> TopSongResponse.builder()
                        .songId((Long) row[0])
                        .totalPlays((Long) row[1])
                        .build())
                .collect(Collectors.toList());

        return ArtistDashboardResponse.builder()
                .artistId(artistId)
                .totalSongs(totalSongs)
                .totalPlays(totalPlays)
                .totalFavorites(totalFavorites)
                .songStats(songStats)
                .topSongs(topSongs)
                .build();
    }

    // Get song stats
    public SongStatsResponse getSongStats(Long songId,
            Long artistId) {

        Long totalPlays = songPlayRepository
                .countBySongId(songId);

        Long totalFavorites = 0L;
        try {
            Object favResponse = favoritesServiceClient
                    .getFavoriteCount(songId, null);
            if (favResponse instanceof Map) {
                Object count = ((Map<?, ?>) favResponse)
                        .get("totalFavorites");
                if (count instanceof Integer) {
                    totalFavorites = ((Integer) count).longValue();
                }
            }
        } catch (Exception e) {
            totalFavorites = 0L;
        }

        return SongStatsResponse.builder()
                .songId(songId)
                .artistId(artistId)
                .totalPlays(totalPlays)
                .totalFavorites(totalFavorites)
                .build();
    }

    // Get daily plays for artist
    public TrendResponse getDailyPlays(Long artistId) {
        LocalDateTime start = LocalDateTime.now()
                .withHour(0).withMinute(0).withSecond(0);
        LocalDateTime end = LocalDateTime.now();

        Long plays = songPlayRepository
                .countByArtistIdAndPlayedAtBetween(
                    artistId, start, end);

        return TrendResponse.builder()
                .period("DAILY")
                .totalPlays(plays)
                .build();
    }

    // Get weekly plays for artist
    public TrendResponse getWeeklyPlays(Long artistId) {
        LocalDateTime start = LocalDateTime.now()
                .minusDays(7);
        LocalDateTime end = LocalDateTime.now();

        Long plays = songPlayRepository
                .countByArtistIdAndPlayedAtBetween(
                    artistId, start, end);

        return TrendResponse.builder()
                .period("WEEKLY")
                .totalPlays(plays)
                .build();
    }

    // Get monthly plays for artist
    public TrendResponse getMonthlyPlays(Long artistId) {
        LocalDateTime start = LocalDateTime.now()
                .minusDays(30);
        LocalDateTime end = LocalDateTime.now();

        Long plays = songPlayRepository
                .countByArtistIdAndPlayedAtBetween(
                    artistId, start, end);

        return TrendResponse.builder()
                .period("MONTHLY")
                .totalPlays(plays)
                .build();
    }

    // Get top listeners for artist
    public List<Long> getTopListeners(Long artistId) {
        return songPlayRepository
                .findDistinctUsersByArtistId(artistId);
    }

    // Get total plays for a song
    public Long getTotalPlaysForSong(Long songId) {
        return songPlayRepository.countBySongId(songId);
    }
}
