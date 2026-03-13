package com.revplay.analyticsservice.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "music-service")
public interface MusicServiceClient {

    @GetMapping("/api/songs/public/{id}")
    Object getSongById(@PathVariable Long id);

    @GetMapping("/api/songs/public/artist/{artistId}")
    Object getSongsByArtist(@PathVariable Long artistId);
}
