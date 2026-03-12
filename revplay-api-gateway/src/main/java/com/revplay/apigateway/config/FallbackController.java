package com.revplay.apigateway.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> userFallback() {
        return buildFallback("user-service");
    }

    @GetMapping("/artist")
    public ResponseEntity<Map<String, Object>> artistFallback() {
        return buildFallback("artist-service");
    }

    @GetMapping("/music")
    public ResponseEntity<Map<String, Object>> musicFallback() {
        return buildFallback("music-service");
    }

    @GetMapping("/playlist")
    public ResponseEntity<Map<String, Object>>
            playlistFallback() {
        return buildFallback("playlist-service");
    }

    @GetMapping("/favorites")
    public ResponseEntity<Map<String, Object>>
            favoritesFallback() {
        return buildFallback("favorites-service");
    }

    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>>
            historyFallback() {
        return buildFallback("history-service");
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>>
            analyticsFallback() {
        return buildFallback("analytics-service");
    }

    private ResponseEntity<Map<String, Object>> buildFallback(
            String serviceName) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp",
                LocalDateTime.now().toString());
        body.put("status",
                HttpStatus.SERVICE_UNAVAILABLE.value());
        body.put("message", serviceName +
                " is currently unavailable." +
                " Please try again later.");
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(body);
    }
}
