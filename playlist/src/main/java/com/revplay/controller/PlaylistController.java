package com.revplay.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.revplay.dto.AddSongRequest;
import com.revplay.dto.CreatePlaylistRequest;
import com.revplay.dto.PlaylistResponse;
import com.revplay.dto.ReorderSongRequest;
import com.revplay.dto.UpdatePlaylistRequest;
import com.revplay.service.PlaylistService;

import java.util.List;

@RestController
@RequestMapping("/api/playlists")
@RequiredArgsConstructor
public class PlaylistController {

    private final PlaylistService playlistService;

    // Create playlist
    @PostMapping
    public ResponseEntity<PlaylistResponse> createPlaylist(
            @Valid @RequestBody CreatePlaylistRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(playlistService.createPlaylist(request));
    }

    // Get playlist by ID
    @GetMapping("/{id}")
    public ResponseEntity<PlaylistResponse> getPlaylistById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                playlistService.getPlaylistById(id));
    }

    // Get playlists by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PlaylistResponse>> getPlaylistsByUser(
            @PathVariable Long userId) {
        return ResponseEntity.ok(
                playlistService.getPlaylistsByUser(userId));
    }

    // Get all public playlists
    @GetMapping("/public")
    public ResponseEntity<List<PlaylistResponse>> getPublicPlaylists() {
        return ResponseEntity.ok(
                playlistService.getPublicPlaylists());
    }

    // Update playlist
    @PutMapping("/{id}")
    public ResponseEntity<PlaylistResponse> updatePlaylist(
            @PathVariable Long id,
            @RequestBody UpdatePlaylistRequest request) {
        return ResponseEntity.ok(
                playlistService.updatePlaylist(id, request));
    }

    // Delete playlist
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePlaylist(
            @PathVariable Long id) {
        playlistService.deletePlaylist(id);
        return ResponseEntity.ok("Playlist deleted successfully");
    }

    // Add song to playlist
    @PostMapping("/{id}/songs")
    public ResponseEntity<PlaylistResponse> addSong(
            @PathVariable Long id,
            @Valid @RequestBody AddSongRequest request) {
        return ResponseEntity.ok(
                playlistService.addSongToPlaylist(id, request));
    }

    // Remove song from playlist
    @DeleteMapping("/{id}/songs/{songId}")
    public ResponseEntity<PlaylistResponse> removeSong(
            @PathVariable Long id,
            @PathVariable Long songId) {
        return ResponseEntity.ok(
                playlistService.removeSongFromPlaylist(id, songId));
    }

    // Reorder song in playlist
    @PutMapping("/{id}/songs/reorder")
    public ResponseEntity<PlaylistResponse> reorderSong(
            @PathVariable Long id,
            @RequestBody ReorderSongRequest request) {
        return ResponseEntity.ok(
                playlistService.reorderSong(id, request));
    }

    // Follow playlist
    @PostMapping("/{playlistId}/follow/{userId}")
    public ResponseEntity<String> followPlaylist(
            @PathVariable Long playlistId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(
                playlistService.followPlaylist(playlistId, userId));
    }

    // Unfollow playlist
    @DeleteMapping("/{playlistId}/unfollow/{userId}")
    public ResponseEntity<String> unfollowPlaylist(
            @PathVariable Long playlistId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(
                playlistService.unfollowPlaylist(
                    playlistId, userId));
    }
}
