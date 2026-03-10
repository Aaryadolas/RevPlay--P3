package com.main.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.main.entity.Artist;

@Repository
public interface ArtistRepository  extends JpaRepository<Artist, Long>{
	Optional<Artist> findByUserId(Long userId);

    Boolean existsByUserId(Long userId);

    Boolean existsByArtistName(String artistName);
}
