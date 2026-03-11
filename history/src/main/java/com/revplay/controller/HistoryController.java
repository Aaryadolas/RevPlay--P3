package com.revplay.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.revplay.dto.HistoryRequest;
import com.revplay.dto.HistoryResponse;
import com.revplay.service.HistoryService;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    // Record song play
    @PostMapping
    public ResponseEntity<HistoryResponse> recordPlay(
            @Valid @RequestBody HistoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(historyService.recordPlay(request));
    }

    // Get full history by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<HistoryResponse>> getFullHistory(
            @PathVariable Long userId) {
        return ResponseEntity.ok(
                historyService.getFullHistoryByUser(userId));
    }

    // Get last 50 recently played
    @GetMapping("/user/{userId}/recent")
    public ResponseEntity<List<HistoryResponse>> getRecentlyPlayed(
            @PathVariable Long userId) {
        return ResponseEntity.ok(
                historyService.getRecentlyPlayed(userId));
    }

    // Get total plays count by user
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Integer> getTotalPlaysByUser(
            @PathVariable Long userId) {
        return ResponseEntity.ok(
                historyService.getTotalPlaysByUser(userId));
    }

    // Get total plays for a song
    @GetMapping("/song/{songId}/count")
    public ResponseEntity<Integer> getTotalPlaysForSong(
            @PathVariable Long songId) {
        return ResponseEntity.ok(
                historyService.getTotalPlaysForSong(songId));
    }

    // Get total listening time by user in seconds
    @GetMapping("/user/{userId}/listening-time")
    public ResponseEntity<Long> getTotalListeningTime(
            @PathVariable Long userId) {
        return ResponseEntity.ok(
                historyService.getTotalListeningTime(userId));
    }

    // Get distinct songs played by user
    @GetMapping("/user/{userId}/songs")
    public ResponseEntity<List<Long>> getDistinctSongsPlayed(
            @PathVariable Long userId) {
        return ResponseEntity.ok(
                historyService.getDistinctSongsPlayed(userId));
    }

    // Clear all history by user
    @DeleteMapping("/user/{userId}/clear")
    public ResponseEntity<String> clearHistory(
            @PathVariable Long userId) {
        historyService.clearHistory(userId);
        return ResponseEntity.ok(
            "Listening history cleared successfully");
    }
}
