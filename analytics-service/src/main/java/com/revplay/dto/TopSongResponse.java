package com.revplay.dto;


import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TopSongResponse {
    private Long songId;
    private Long totalPlays;
}