package com.revplay.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.revplay.entity.PlaylistSong;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaylistSongRepository
        extends JpaRepository<PlaylistSong, Long> {

    List<PlaylistSong> findByPlaylistIdOrderByPositionAsc(
            Long playlistId);

    Optional<PlaylistSong> findByPlaylistIdAndSongId(
            Long playlistId, Long songId);

    Boolean existsByPlaylistIdAndSongId(
            Long playlistId, Long songId);

    Integer countByPlaylistId(Long playlistId);
}
