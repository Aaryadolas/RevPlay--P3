package com.revplay.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "listening_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListeningHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // links to user-service
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // links to music-service
    @Column(name = "song_id", nullable = false)
    private Long songId;

    // how long user listened in seconds
    @Column(name = "listened_duration")
    private Integer listenedDuration;

    @CreationTimestamp
    @Column(name = "played_at", updatable = false)
    private LocalDateTime playedAt;
}
