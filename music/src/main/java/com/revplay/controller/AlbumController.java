package com.revplay.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.revplay.dto.AlbumResponse;
import com.revplay.dto.CreateAlbumRequest;
import com.revplay.dto.UpdateAlbumRequest;
import com.revplay.service.AlbumService;

import java.util.List;

@RestController
@RequestMapping("/api/albums")
@RequiredArgsConstructor
public class AlbumController {

    private final AlbumService albumService;

    // Create album — ARTIST only
    @PostMapping
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<AlbumResponse> createAlbum(
            @Valid @RequestBody CreateAlbumRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(albumService.createAlbum(request));
    }

    // Get album by ID — public
    @GetMapping("/public/{id}")
    public ResponseEntity<AlbumResponse> getAlbumById(
            @PathVariable Long id) {
        return ResponseEntity.ok(albumService.getAlbumById(id));
    }

    // Get all albums — public
    @GetMapping("/public")
    public ResponseEntity<List<AlbumResponse>> getAllAlbums() {
        return ResponseEntity.ok(albumService.getAllAlbums());
    }

    // Get albums by artist — public
    @GetMapping("/public/artist/{artistId}")
    public ResponseEntity<List<AlbumResponse>> getAlbumsByArtist(
            @PathVariable Long artistId) {
        return ResponseEntity.ok(
                albumService.getAlbumsByArtist(artistId));
    }

    // Update album — ARTIST only
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<AlbumResponse> updateAlbum(
            @PathVariable Long id,
            @RequestBody UpdateAlbumRequest request) {
        return ResponseEntity.ok(albumService.updateAlbum(id, request));
    }

    // Delete album — ARTIST only
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<String> deleteAlbum(@PathVariable Long id) {
        albumService.deleteAlbum(id);
        return ResponseEntity.ok("Album deleted successfully");
    }
}
