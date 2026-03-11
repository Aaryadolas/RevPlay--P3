package com.revplay.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.revplay.entity.Favorite;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

	// get all favorites by user
	List<Favorite> findByUserId(Long userId);

	// get all users who favorited a song
	List<Favorite> findBySongId(Long songId);

	// check if user already favorited a song
	Boolean existsByUserIdAndSongId(Long userId, Long songId);

	// find specific favorite
	Optional<Favorite> findByUserIdAndSongId(Long userId, Long songId);

	// count total favorites for a song
	Integer countBySongId(Long songId);

	// count total favorites by user
	Integer countByUserId(Long userId);
}
