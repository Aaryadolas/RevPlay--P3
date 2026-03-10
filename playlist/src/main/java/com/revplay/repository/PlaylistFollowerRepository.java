package com.revplay.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.revplay.entity.PlaylistFollower;

import java.util.Optional;

@Repository
public interface PlaylistFollowerRepository
        extends JpaRepository<PlaylistFollower, Long> {

    Boolean existsByPlaylistIdAndUserId(
            Long playlistId, Long userId);

    Optional<PlaylistFollower> findByPlaylistIdAndUserId(
            Long playlistId, Long userId);

    Integer countByPlaylistId(Long playlistId);
}
