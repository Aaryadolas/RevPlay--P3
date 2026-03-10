package com.main.controller;



import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.main.dto.ArtistResponse;
import com.main.dto.CreateArtistRequest;
import com.main.dto.SocialLinksRequest;
import com.main.dto.UpdateArtistRequest;
import com.main.service.ArtistService;

import java.util.List;

@RestController
@RequestMapping("/api/artists")
@RequiredArgsConstructor
public class ArtistController {

    private final ArtistService artistService;

    // Create artist profile — only ARTIST role
    @PostMapping
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<ArtistResponse> createArtist(
            @Valid @RequestBody CreateArtistRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(artistService.createArtist(request));
    }

    // Get artist by artist ID — public
    @GetMapping("/public/{id}")
    public ResponseEntity<ArtistResponse> getArtistById(
            @PathVariable Long id) {
        return ResponseEntity.ok(artistService.getArtistById(id));
    }

    // Get artist by user ID — public
    @GetMapping("/public/user/{userId}")
    public ResponseEntity<ArtistResponse> getArtistByUserId(
            @PathVariable Long userId) {
        return ResponseEntity.ok(artistService.getArtistByUserId(userId));
    }

    // Get all artists — public
    @GetMapping("/public")
    public ResponseEntity<List<ArtistResponse>> getAllArtists() {
        return ResponseEntity.ok(artistService.getAllArtists());
    }

    // Update artist profile — only ARTIST role
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<ArtistResponse> updateArtist(
            @PathVariable Long id,
            @RequestBody UpdateArtistRequest request) {
        return ResponseEntity.ok(artistService.updateArtist(id, request));
    }

    // Update social links — only ARTIST role
    @PutMapping("/{id}/social-links")
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<ArtistResponse> updateSocialLinks(
            @PathVariable Long id,
            @RequestBody SocialLinksRequest request) {
        return ResponseEntity.ok(
                artistService.updateSocialLinks(id, request));
    }

    // Delete artist — only ARTIST role
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<String> deleteArtist(@PathVariable Long id) {
        artistService.deleteArtist(id);
        return ResponseEntity.ok("Artist deleted successfully");
    }
}
