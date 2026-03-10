package com.revplay.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.revplay.dto.CreateSongRequest;
import com.revplay.dto.SongResponse;
import com.revplay.dto.UpdateSongRequest;
import com.revplay.service.SongService;

import java.util.List;

@RestController
@RequestMapping("/api/songs")
@RequiredArgsConstructor
public class SongController {

    private final SongService songService;

    // Upload song — ARTIST only
    @PostMapping
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<SongResponse> createSong(
            @Valid @RequestBody CreateSongRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(songService.createSong(request));
    }

    // Get song by ID — public
    @GetMapping("/public/{id}")
    public ResponseEntity<SongResponse> getSongById(
            @PathVariable Long id) {
        return ResponseEntity.ok(songService.getSongById(id));
    }

    // Get all public songs
    @GetMapping("/public")
    public ResponseEntity<List<SongResponse>> getAllPublicSongs() {
        return ResponseEntity.ok(songService.getAllPublicSongs());
    }

    // Search songs by title — public
    @GetMapping("/public/search")
    public ResponseEntity<List<SongResponse>> searchSongs(
            @RequestParam String title) {
        return ResponseEntity.ok(
                songService.searchSongsByTitle(title));
    }

    // Get songs by genre — public
    @GetMapping("/public/genre/{genre}")
    public ResponseEntity<List<SongResponse>> getSongsByGenre(
            @PathVariable String genre) {
        return ResponseEntity.ok(songService.getSongsByGenre(genre));
    }

    // Get songs by artist — public
    @GetMapping("/public/artist/{artistId}")
    public ResponseEntity<List<SongResponse>> getSongsByArtist(
            @PathVariable Long artistId) {
        return ResponseEntity.ok(
                songService.getSongsByArtist(artistId));
    }

    // Update song — ARTIST only
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<SongResponse> updateSong(
            @PathVariable Long id,
            @RequestBody UpdateSongRequest request) {
        return ResponseEntity.ok(songService.updateSong(id, request));
    }

    // Delete song — ARTIST only
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<String> deleteSong(@PathVariable Long id) {
        songService.deleteSong(id);
        return ResponseEntity.ok("Song deleted successfully");
    }

    // Increment play count
    @PutMapping("/public/{id}/play")
    public ResponseEntity<SongResponse> incrementPlayCount(
            @PathVariable Long id) {
        return ResponseEntity.ok(songService.incrementPlayCount(id));
    }
}
