package com.revplay.analyticsservice.dto;


import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TrendResponse {
    private String period;
    private Long totalPlays;
}