package com.revplay.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "artist-service")
public interface ArtistServiceClient {

    @GetMapping("/api/artists/public/{id}")
    Object getArtistById(@PathVariable Long id);
}