package com.revplay.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.revplay.client.MusicServiceClient;
import com.revplay.dto.FavoriteCountResponse;
import com.revplay.dto.FavoriteRequest;
import com.revplay.dto.FavoriteResponse;
import com.revplay.entity.Favorite;
import com.revplay.exception.ResourceNotFoundException;
import com.revplay.repository.FavoriteRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final MusicServiceClient musicServiceClient;
    // Add song to favorites
    public FavoriteResponse addFavorite(FavoriteRequest request) {

        // validate song exists in music-service
        try {
            musicServiceClient.getSongById(request.getSongId());
        } catch (Exception e) {
            throw new RuntimeException(
                "Song not found with id: " + request.getSongId());
        }

        // rest of existing code stays same...
        if (favoriteRepository.existsByUserIdAndSongId(
                request.getUserId(), request.getSongId())) {
            throw new RuntimeException(
                "Song is already in favorites");
        }

        Favorite favorite = Favorite.builder()
                .userId(request.getUserId())
                .songId(request.getSongId())
                .build();

        return mapToResponse(favoriteRepository.save(favorite));
    }

    // Remove song from favorites
    public void removeFavorite(Long userId, Long songId) {

        Favorite favorite = favoriteRepository
                .findByUserIdAndSongId(userId, songId)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Favorite not found"));

        favoriteRepository.delete(favorite);
    }

    // Get all favorites by user
    public List<FavoriteResponse> getFavoritesByUser(Long userId) {
        return favoriteRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Check if song is favorited by user
    public Boolean isFavorited(Long userId, Long songId) {
        return favoriteRepository
                .existsByUserIdAndSongId(userId, songId);
    }

    // Get total favorites count for a song
    public FavoriteCountResponse getFavoriteCount(
            Long songId, Long userId) {

        Integer count = favoriteRepository.countBySongId(songId);
        Boolean isFavorited = userId != null
                && favoriteRepository
                    .existsByUserIdAndSongId(userId, songId);

        return FavoriteCountResponse.builder()
                .songId(songId)
                .totalFavorites(count)
                .isFavorited(isFavorited)
                .build();
    }

    // Get total favorites count for user
    public Integer getTotalFavoritesByUser(Long userId) {
        return favoriteRepository.countByUserId(userId);
    }

    // Get all users who favorited a song
    public List<FavoriteResponse> getUsersWhoFavoritedSong(
            Long songId) {
        return favoriteRepository.findBySongId(songId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Map to response
    private FavoriteResponse mapToResponse(Favorite favorite) {
        return FavoriteResponse.builder()
                .id(favorite.getId())
                .userId(favorite.getUserId())
                .songId(favorite.getSongId())
                .createdAt(favorite.getCreatedAt())
                .build();
    }
}
