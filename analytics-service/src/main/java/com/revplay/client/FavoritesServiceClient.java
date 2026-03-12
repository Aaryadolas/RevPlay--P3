package com.revplay.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "favorites-service")
public interface FavoritesServiceClient {

    @GetMapping("/api/favorites/public/song/{songId}/count")
    Object getFavoriteCount(
            @PathVariable Long songId,
            @RequestParam(required = false) Long userId);

    @GetMapping("/api/favorites/song/{songId}/users")
    Object getUsersWhoFavoritedSong(@PathVariable Long songId);
}