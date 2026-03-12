package com.revplay.apigateway.filter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter implements GlobalFilter, Ordered {

    private final JwtService jwtService;

    // public endpoints - no token needed
    private final List<String> PUBLIC_ENDPOINTS = List.of(
            "/api/users/register",
            "/api/users/login",
            "/api/songs/public",
            "/api/albums/public",
            "/api/artists/public",
            "/api/genres",
            "/api/favorites/public",
            "/api/analytics/public",
            "/fallback"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange,
                             GatewayFilterChain chain) {

        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        log.info("Incoming request: {}", path);

        // skip JWT check for public endpoints
        if (isPublicEndpoint(path)) {
            return chain.filter(exchange);
        }

        // check if Authorization header exists
        if (!request.getHeaders()
                .containsKey("Authorization")) {
            return onError(exchange,
                    "Authorization header is missing",
                    HttpStatus.UNAUTHORIZED);
        }

        String authHeader = request.getHeaders()
                .getFirst("Authorization");

        // check Bearer format
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {
            return onError(exchange,
                    "Invalid Authorization format",
                    HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);

        // validate token
        if (!jwtService.validateToken(token)) {
            return onError(exchange,
                    "Invalid or expired token",
                    HttpStatus.UNAUTHORIZED);
        }

        // extract info from token
        String email = jwtService.extractEmail(token);
        String role = jwtService.extractRole(token);
        Long userId = jwtService.extractUserId(token);

        // add user info to request headers
        // so downstream services can use it
        ServerHttpRequest modifiedRequest = request
                .mutate()
                .header("X-User-Email", email)
                .header("X-User-Role", role)
                .header("X-User-Id", String.valueOf(userId))
                .build();

        log.info("Authenticated user: {} role: {}",
                email, role);

        return chain.filter(
                exchange.mutate()
                        .request(modifiedRequest)
                        .build()
        );
    }

    private boolean isPublicEndpoint(String path) {
        return PUBLIC_ENDPOINTS.stream()
                .anyMatch(path::startsWith);
    }

    private Mono<Void> onError(ServerWebExchange exchange,
                                String message,
                                HttpStatus status) {
        log.error("Gateway auth error: {}", message);
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        return response.setComplete();
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
