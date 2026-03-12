package com.revplay.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.revplay.entity.SongPlay;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SongPlayRepository
        extends JpaRepository<SongPlay, Long> {

    // total plays for a song
    Long countBySongId(Long songId);

    // total plays for an artist
    Long countByArtistId(Long artistId);

    // plays by user
    Long countByUserId(Long userId);

    // get all plays for a song
    List<SongPlay> findBySongId(Long songId);

    // get all plays for an artist
    List<SongPlay> findByArtistId(Long artistId);

    // get distinct users who played artist songs
    @Query("SELECT DISTINCT s.userId FROM SongPlay s " +
           "WHERE s.artistId = :artistId")
    List<Long> findDistinctUsersByArtistId(
            @Param("artistId") Long artistId);

    // daily plays for artist
    @Query("SELECT COUNT(s) FROM SongPlay s " +
           "WHERE s.artistId = :artistId " +
           "AND s.playedAt >= :start " +
           "AND s.playedAt <= :end")
    Long countByArtistIdAndPlayedAtBetween(
            @Param("artistId") Long artistId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    // top songs by play count for artist
    @Query("SELECT s.songId, COUNT(s) as plays " +
           "FROM SongPlay s " +
           "WHERE s.artistId = :artistId " +
           "GROUP BY s.songId " +
           "ORDER BY plays DESC")
    List<Object[]> findTopSongsByArtistId(
            @Param("artistId") Long artistId);

    // plays per song
    @Query("SELECT s.songId, COUNT(s) as plays " +
           "FROM SongPlay s " +
           "WHERE s.artistId = :artistId " +
           "GROUP BY s.songId")
    List<Object[]> findPlayCountPerSongByArtistId(
            @Param("artistId") Long artistId);
}
