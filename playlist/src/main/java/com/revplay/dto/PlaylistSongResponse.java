package com.revplay.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlaylistSongResponse {
    private Long id;
    private Long songId;
    private Integer position;
    private LocalDateTime addedAt;
}
