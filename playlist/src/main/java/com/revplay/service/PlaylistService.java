package com.revplay.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.revplay.client.MusicServiceClient;
import com.revplay.dto.AddSongRequest;
import com.revplay.dto.CreatePlaylistRequest;
import com.revplay.dto.PlaylistResponse;
import com.revplay.dto.PlaylistSongResponse;
import com.revplay.dto.ReorderSongRequest;
import com.revplay.dto.UpdatePlaylistRequest;
import com.revplay.entity.Playlist;
import com.revplay.entity.PlaylistFollower;
import com.revplay.entity.PlaylistSong;
import com.revplay.entity.Privacy;
import com.revplay.exception.ResourceNotFoundException;
import com.revplay.repository.PlaylistFollowerRepository;
import com.revplay.repository.PlaylistRepository;
import com.revplay.repository.PlaylistSongRepository;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final PlaylistSongRepository playlistSongRepository;
    private final PlaylistFollowerRepository playlistFollowerRepository;
    private final MusicServiceClient musicServiceClient;

    // Create playlist
    public PlaylistResponse createPlaylist(
            CreatePlaylistRequest request) {

        Privacy privacy = Privacy.PUBLIC;
        if (request.getPrivacy() != null &&
                request.getPrivacy().equalsIgnoreCase("PRIVATE")) {
            privacy = Privacy.PRIVATE;
        }

        Playlist playlist = Playlist.builder()
                .userId(request.getUserId())
                .name(request.getName())
                .description(request.getDescription())
                .privacy(privacy)
                .build();

        return mapToResponse(playlistRepository.save(playlist));
    }

    // Get playlist by ID
    public PlaylistResponse getPlaylistById(Long id) {
        Playlist playlist = playlistRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Playlist not found with id: " + id));
        return mapToResponse(playlist);
    }

    // Get all playlists by user
    public List<PlaylistResponse> getPlaylistsByUser(Long userId) {
        return playlistRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get all public playlists
    public List<PlaylistResponse> getPublicPlaylists() {
        return playlistRepository.findByPrivacy(Privacy.PUBLIC)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Update playlist
    public PlaylistResponse updatePlaylist(Long id,
            UpdatePlaylistRequest request) {

        Playlist playlist = playlistRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Playlist not found with id: " + id));

        if (request.getName() != null)
            playlist.setName(request.getName());
        if (request.getDescription() != null)
            playlist.setDescription(request.getDescription());
        if (request.getPrivacy() != null)
            playlist.setPrivacy(Privacy.valueOf(
                request.getPrivacy().toUpperCase()));

        return mapToResponse(playlistRepository.save(playlist));
    }

    // Delete playlist
    public void deletePlaylist(Long id) {
        Playlist playlist = playlistRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Playlist not found with id: " + id));
        playlistRepository.delete(playlist);
    }

    // Add song to playlist
    public PlaylistResponse addSongToPlaylist(Long playlistId,
            AddSongRequest request) {

        // validate song exists in music-service
        try {
            musicServiceClient.getSongById(request.getSongId());
        } catch (Exception e) {
            throw new RuntimeException(
                "Song not found with id: " + request.getSongId());
        }

        // rest of existing code stays same...
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Playlist not found with id: " + playlistId));

        if (playlistSongRepository.existsByPlaylistIdAndSongId(
                playlistId, request.getSongId())) {
            throw new RuntimeException(
                "Song already exists in playlist");
        }

        Integer count = playlistSongRepository
                .countByPlaylistId(playlistId);

        PlaylistSong playlistSong = PlaylistSong.builder()
                .playlist(playlist)
                .songId(request.getSongId())
                .position(count + 1)
                .build();

        playlistSongRepository.save(playlistSong);
        return mapToResponse(playlistRepository
                .findById(playlistId).get());
    }

    // Remove song from playlist
    public PlaylistResponse removeSongFromPlaylist(
            Long playlistId, Long songId) {

        PlaylistSong playlistSong = playlistSongRepository
                .findByPlaylistIdAndSongId(playlistId, songId)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Song not found in playlist"));

        playlistSongRepository.delete(playlistSong);

        // reorder remaining songs
        List<PlaylistSong> remaining = playlistSongRepository
                .findByPlaylistIdOrderByPositionAsc(playlistId);

        for (int i = 0; i < remaining.size(); i++) {
            remaining.get(i).setPosition(i + 1);
        }
        playlistSongRepository.saveAll(remaining);

        return mapToResponse(playlistRepository
                .findById(playlistId).get());
    }

    // Reorder song in playlist
    public PlaylistResponse reorderSong(Long playlistId,
            ReorderSongRequest request) {

        PlaylistSong playlistSong = playlistSongRepository
                .findByPlaylistIdAndSongId(
                    playlistId, request.getSongId())
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Song not found in playlist"));

        playlistSong.setPosition(request.getNewPosition());
        playlistSongRepository.save(playlistSong);

        return mapToResponse(playlistRepository
                .findById(playlistId).get());
    }

    // Follow playlist
    public String followPlaylist(Long playlistId, Long userId) {

        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Playlist not found with id: " + playlistId));

        if (playlist.getPrivacy() == Privacy.PRIVATE) {
            throw new RuntimeException(
                "Cannot follow a private playlist");
        }

        if (playlistFollowerRepository
                .existsByPlaylistIdAndUserId(playlistId, userId)) {
            throw new RuntimeException(
                "Already following this playlist");
        }

        PlaylistFollower follower = PlaylistFollower.builder()
                .playlist(playlist)
                .userId(userId)
                .build();

        playlistFollowerRepository.save(follower);
        return "Playlist followed successfully";
    }

    // Unfollow playlist
    public String unfollowPlaylist(Long playlistId, Long userId) {

        PlaylistFollower follower = playlistFollowerRepository
                .findByPlaylistIdAndUserId(playlistId, userId)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "You are not following this playlist"));

        playlistFollowerRepository.delete(follower);
        return "Playlist unfollowed successfully";
    }

    // Map to response
    private PlaylistResponse mapToResponse(Playlist playlist) {

        List<PlaylistSongResponse> songs =
            playlist.getPlaylistSongs() != null
                ? playlist.getPlaylistSongs().stream()
                    .map(ps -> PlaylistSongResponse.builder()
                        .id(ps.getId())
                        .songId(ps.getSongId())
                        .position(ps.getPosition())
                        .addedAt(ps.getAddedAt())
                        .build())
                    .collect(Collectors.toList())
                : Collections.emptyList();

        return PlaylistResponse.builder()
                .id(playlist.getId())
                .userId(playlist.getUserId())
                .name(playlist.getName())
                .description(playlist.getDescription())
                .privacy(playlist.getPrivacy().name())
                .totalSongs(songs.size())
                .songs(songs)
                .createdAt(playlist.getCreatedAt())
                .build();
    }
}
