package com.revplay.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GenreResponse {
	private Long id;
	private String name;
}
