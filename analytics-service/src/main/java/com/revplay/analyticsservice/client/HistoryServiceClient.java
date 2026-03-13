package com.revplay.analyticsservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "history-service")
public interface HistoryServiceClient {

    @GetMapping("/api/history/song/{songId}/count")
    Integer getTotalPlaysForSong(@PathVariable Long songId);

    @GetMapping("/api/history/user/{userId}/count")
    Integer getTotalPlaysByUser(@PathVariable Long userId);
}