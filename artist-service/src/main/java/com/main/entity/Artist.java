package com.main.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "artists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // links to user-service userId
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "artist_name", nullable = false)
    private String artistName;

    @Column(length = 1000)
    private String bio;

    private String genre;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "banner_image")
    private String bannerImage;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
