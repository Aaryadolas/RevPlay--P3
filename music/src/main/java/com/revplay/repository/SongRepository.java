package com.revplay.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.revplay.entity.Song;
import com.revplay.entity.Visibility;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {

	List<Song> findByArtistId(Long artistId);

	List<Song> findByVisibility(Visibility visibility);

	List<Song> findByGenreIgnoreCase(String genre);

	List<Song> findByTitleContainingIgnoreCase(String title);

	List<Song> findByArtistIdAndVisibility(Long artistId, Visibility visibility);
}