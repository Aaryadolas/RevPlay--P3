package com.revplay.dto;


import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteCountResponse {
    private Long songId;
    private Integer totalFavorites;
    private Boolean isFavorited;
}