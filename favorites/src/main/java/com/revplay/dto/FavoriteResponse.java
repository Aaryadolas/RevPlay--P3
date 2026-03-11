package com.revplay.dto;


import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteResponse {
    private Long id;
    private Long userId;
    private Long songId;
    private LocalDateTime createdAt;
}
