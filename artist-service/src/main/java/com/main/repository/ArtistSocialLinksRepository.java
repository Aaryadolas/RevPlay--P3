package com.main.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.main.entity.ArtistSocialLinks;

public interface ArtistSocialLinksRepository extends JpaRepository<ArtistSocialLinks, Long> {
	Optional<ArtistSocialLinks> findByArtistId(Long artistId);
}
