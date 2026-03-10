package com.revplay.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.revplay.entity.Playlist;
import com.revplay.entity.Privacy;

import java.util.List;

@Repository
public interface PlaylistRepository
        extends JpaRepository<Playlist, Long> {

    List<Playlist> findByUserId(Long userId);

    List<Playlist> findByPrivacy(Privacy privacy);

    List<Playlist> findByUserIdAndPrivacy(Long userId, Privacy privacy);
}