package com.revplay.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "albums")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // links to artist-service
    @Column(name = "artist_id", nullable = false)
    private Long artistId;

    @Column(name = "album_name", nullable = false)
    private String albumName;

    @Column(length = 1000)
    private String description;

    @Column(name = "cover_image")
    private String coverImage;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @OneToMany(mappedBy = "album",
               cascade = CascadeType.ALL,
               fetch = FetchType.LAZY)
    private List<Song> songs;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
