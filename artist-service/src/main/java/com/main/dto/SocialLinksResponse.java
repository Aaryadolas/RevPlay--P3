package com.main.dto;


import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SocialLinksResponse {
    private String instagram;
    private String twitter;
    private String youtube;
    private String spotify;
    private String website;
}
