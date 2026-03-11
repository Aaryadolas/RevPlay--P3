package com.revplay.repository;


import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.revplay.entity.ListeningHistory;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ListeningHistoryRepository
        extends JpaRepository<ListeningHistory, Long> {

    // get all history by user ordered by latest
    List<ListeningHistory> findByUserIdOrderByPlayedAtDesc(
            Long userId);

    // get last 50 songs played by user
    List<ListeningHistory> findByUserIdOrderByPlayedAtDesc(
            Long userId, Pageable pageable);

    // get history by user and song
    List<ListeningHistory> findByUserIdAndSongId(
            Long userId, Long songId);

    // count total plays by user
    Integer countByUserId(Long userId);

    // count total plays for a song
    Integer countBySongId(Long songId);

    // delete all history by user
    void deleteByUserId(Long userId);

    // get history between dates
    List<ListeningHistory> findByUserIdAndPlayedAtBetween(
            Long userId,
            LocalDateTime start,
            LocalDateTime end);

    // get distinct songs played by user
    @Query("SELECT DISTINCT h.songId FROM " +
           "ListeningHistory h WHERE h.userId = :userId " +
           "ORDER BY h.songId")
    List<Long> findDistinctSongIdsByUserId(
            @Param("userId") Long userId);

    // get total listening time by user in seconds
    @Query("SELECT COALESCE(SUM(h.listenedDuration), 0) " +
           "FROM ListeningHistory h WHERE h.userId = :userId")
    Long getTotalListeningTimeByUser(
            @Param("userId") Long userId);
}
