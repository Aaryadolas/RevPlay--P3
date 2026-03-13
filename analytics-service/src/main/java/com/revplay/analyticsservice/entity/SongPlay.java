package com.revplay.analyticsservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "song_plays")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SongPlay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // links to music-service
    @Column(name = "song_id", nullable = false)
    private Long songId;

    // links to artist-service
    @Column(name = "artist_id", nullable = false)
    private Long artistId;

    // links to user-service
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @CreationTimestamp
    @Column(name = "played_at", updatable = false)
    private LocalDateTime playedAt;
}