package com.revplay.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.revplay.dto.FavoriteCountResponse;
import com.revplay.dto.FavoriteRequest;
import com.revplay.dto.FavoriteResponse;
import com.revplay.service.FavoriteService;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    // Add to favorites
    @PostMapping
    public ResponseEntity<FavoriteResponse> addFavorite(
            @Valid @RequestBody FavoriteRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        request.setUserId(userId); // ← from token
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(favoriteService.addFavorite(request));
    }

    // Remove from favorites
    @DeleteMapping("/song/{songId}")
    public ResponseEntity<String> removeFavorite(
            @PathVariable Long songId,
            @RequestHeader("X-User-Id") Long userId) {
        favoriteService.removeFavorite(userId, songId);
        return ResponseEntity.ok(
            "Song removed from favorites successfully");
    }

    // Get all favorites by user
    @GetMapping("/user")
    public ResponseEntity<List<FavoriteResponse>> getFavoritesByUser(
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(
                favoriteService.getFavoritesByUser(userId));
    }

    // Check if song is favorited
    @GetMapping("/check/song/{songId}")
    public ResponseEntity<Boolean> isFavorited(
            @PathVariable Long songId,
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(
                favoriteService.isFavorited(userId, songId));
    }

    // Get favorite count for a song — public
    @GetMapping("/public/song/{songId}/count")
    public ResponseEntity<FavoriteCountResponse> getFavoriteCount(
            @PathVariable Long songId,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(
                favoriteService.getFavoriteCount(songId, userId));
    }

    // Get total favorites count for user
    @GetMapping("/user/count")
    public ResponseEntity<Integer> getTotalFavoritesByUser(
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(
                favoriteService.getTotalFavoritesByUser(userId));
    }

    // Get users who favorited a song — for artist analytics
    @GetMapping("/song/{songId}/users")
    public ResponseEntity<List<FavoriteResponse>>
            getUsersWhoFavoritedSong(
                @PathVariable Long songId,
                @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(
                favoriteService.getUsersWhoFavoritedSong(songId));
    }
}