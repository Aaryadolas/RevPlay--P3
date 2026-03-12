package com.revplay.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SongPlayResponse {
    private Long id;
    private Long songId;
    private Long artistId;
    private Long userId;
    private LocalDateTime playedAt;
}
