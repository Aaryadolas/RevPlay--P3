package com.revplay.dto;


import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HistoryResponse {
    private Long id;
    private Long userId;
    private Long songId;
    private Integer listenedDuration;
    private LocalDateTime playedAt;
}