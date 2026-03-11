package com.revplay.service;



import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.revplay.client.MusicServiceClient;
import com.revplay.dto.HistoryRequest;
import com.revplay.dto.HistoryResponse;
import com.revplay.entity.ListeningHistory;
import com.revplay.repository.ListeningHistoryRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final ListeningHistoryRepository historyRepository; 
    private final MusicServiceClient musicServiceClient;


    // Record a song play
    public HistoryResponse recordPlay(HistoryRequest request) {

        // validate song exists in music-service
        try {
            musicServiceClient.getSongById(request.getSongId());
        } catch (Exception e) {
            throw new RuntimeException(
                "Song not found with id: " + request.getSongId());
        }

        // rest of existing code stays same...
        ListeningHistory history = ListeningHistory.builder()
                .userId(request.getUserId())
                .songId(request.getSongId())
                .listenedDuration(request.getListenedDuration())
                .build();

        return mapToResponse(historyRepository.save(history));
    }

    // Get full history by user
    public List<HistoryResponse> getFullHistoryByUser(Long userId) {
        return historyRepository
                .findByUserIdOrderByPlayedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get last 50 recently played songs
    public List<HistoryResponse> getRecentlyPlayed(Long userId) {
        return historyRepository
                .findByUserIdOrderByPlayedAtDesc(
                    userId, PageRequest.of(0, 50))
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get total plays count by user
    public Integer getTotalPlaysByUser(Long userId) {
        return historyRepository.countByUserId(userId);
    }

    // Get total plays count for a song
    public Integer getTotalPlaysForSong(Long songId) {
        return historyRepository.countBySongId(songId);
    }

    // Get total listening time by user in seconds
    public Long getTotalListeningTime(Long userId) {
        return historyRepository
                .getTotalListeningTimeByUser(userId);
    }

    // Get distinct songs played by user
    public List<Long> getDistinctSongsPlayed(Long userId) {
        return historyRepository
                .findDistinctSongIdsByUserId(userId);
    }

    // Clear all history by user
    @Transactional
    public void clearHistory(Long userId) {
        historyRepository.deleteByUserId(userId);
    }

    // Map to response
    private HistoryResponse mapToResponse(
            ListeningHistory history) {
        return HistoryResponse.builder()
                .id(history.getId())
                .userId(history.getUserId())
                .songId(history.getSongId())
                .listenedDuration(history.getListenedDuration())
                .playedAt(history.getPlayedAt())
                .build();
    }
}