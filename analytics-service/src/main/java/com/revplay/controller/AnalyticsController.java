package com.revplay.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.revplay.dto.ArtistDashboardResponse;
import com.revplay.dto.SongPlayRequest;
import com.revplay.dto.SongPlayResponse;
import com.revplay.dto.SongStatsResponse;
import com.revplay.dto.TrendResponse;
import com.revplay.service.AnalyticsService;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    // Record song play
    @PostMapping("/play")
    public ResponseEntity<SongPlayResponse> recordPlay(
            @Valid @RequestBody SongPlayRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(analyticsService.recordPlay(request));
    }

    // Get artist dashboard — ARTIST only
    @GetMapping("/dashboard/artist/{artistId}")
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<ArtistDashboardResponse> getArtistDashboard(
            @PathVariable Long artistId) {
        return ResponseEntity.ok(
                analyticsService.getArtistDashboard(artistId));
    }

    // Get song stats — public
    @GetMapping("/public/songs/{songId}/stats")
    public ResponseEntity<SongStatsResponse> getSongStats(
            @PathVariable Long songId,
            @RequestParam Long artistId) {
        return ResponseEntity.ok(
                analyticsService.getSongStats(songId, artistId));
    }

    // Get daily plays — ARTIST only
    @GetMapping("/trends/daily/artist/{artistId}")
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<TrendResponse> getDailyPlays(
            @PathVariable Long artistId) {
        return ResponseEntity.ok(
                analyticsService.getDailyPlays(artistId));
    }

    // Get weekly plays — ARTIST only
    @GetMapping("/trends/weekly/artist/{artistId}")
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<TrendResponse> getWeeklyPlays(
            @PathVariable Long artistId) {
        return ResponseEntity.ok(
                analyticsService.getWeeklyPlays(artistId));
    }

    // Get monthly plays — ARTIST only
    @GetMapping("/trends/monthly/artist/{artistId}")
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<TrendResponse> getMonthlyPlays(
            @PathVariable Long artistId) {
        return ResponseEntity.ok(
                analyticsService.getMonthlyPlays(artistId));
    }

    // Get top listeners — ARTIST only
    @GetMapping("/listeners/artist/{artistId}")
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<List<Long>> getTopListeners(
            @PathVariable Long artistId) {
        return ResponseEntity.ok(
                analyticsService.getTopListeners(artistId));
    }

    // Get total plays for song — public
    @GetMapping("/public/songs/{songId}/plays")
    public ResponseEntity<Long> getTotalPlaysForSong(
            @PathVariable Long songId) {
        return ResponseEntity.ok(
                analyticsService.getTotalPlaysForSong(songId));
    }
}