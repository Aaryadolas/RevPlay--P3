package com.revplay.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.revplay.dto.AlbumResponse;
import com.revplay.dto.CreateAlbumRequest;
import com.revplay.dto.SongResponse;
import com.revplay.dto.UpdateAlbumRequest;
import com.revplay.entity.Album;
import com.revplay.exception.ResourceNotFoundException;
import com.revplay.repository.AlbumRepository;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlbumService {

    private final AlbumRepository albumRepository;

    public AlbumResponse createAlbum(CreateAlbumRequest request) {
        Album album = Album.builder()
                .artistId(request.getArtistId())
                .albumName(request.getAlbumName())
                .description(request.getDescription())
                .coverImage(request.getCoverImage())
                .releaseDate(request.getReleaseDate() != null
                        ? LocalDate.parse(request.getReleaseDate())
                        : null)
                .build();
        return mapToResponse(albumRepository.save(album));
    }

    public AlbumResponse getAlbumById(Long id) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Album not found with id: " + id));
        return mapToResponse(album);
    }

    public List<AlbumResponse> getAlbumsByArtist(Long artistId) {
        return albumRepository.findByArtistId(artistId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AlbumResponse> getAllAlbums() {
        return albumRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AlbumResponse updateAlbum(Long id,
                                      UpdateAlbumRequest request) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Album not found with id: " + id));

        if (request.getAlbumName() != null)
            album.setAlbumName(request.getAlbumName());
        if (request.getDescription() != null)
            album.setDescription(request.getDescription());
        if (request.getCoverImage() != null)
            album.setCoverImage(request.getCoverImage());
        if (request.getReleaseDate() != null)
            album.setReleaseDate(LocalDate.parse(request.getReleaseDate()));

        return mapToResponse(albumRepository.save(album));
    }

    public void deleteAlbum(Long id) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Album not found with id: " + id));
        albumRepository.delete(album);
    }

    public AlbumResponse mapToResponse(Album album) {
        List<SongResponse> songResponses = album.getSongs() != null
                ? album.getSongs().stream()
                    .map(song -> SongResponse.builder()
                        .id(song.getId())
                        .title(song.getTitle())
                        .artistId(song.getArtistId())
                        .albumId(album.getId())
                        .albumName(album.getAlbumName())
                        .genre(song.getGenre())
                        .duration(song.getDuration())
                        .audioUrl(song.getAudioUrl())
                        .coverImage(song.getCoverImage())
                        .releaseDate(song.getReleaseDate())
                        .visibility(song.getVisibility().name())
                        .playCount(song.getPlayCount())
                        .createdAt(song.getCreatedAt())
                        .build())
                    .collect(Collectors.toList())
                : Collections.emptyList();

        return AlbumResponse.builder()
                .id(album.getId())
                .artistId(album.getArtistId())
                .albumName(album.getAlbumName())
                .description(album.getDescription())
                .coverImage(album.getCoverImage())
                .releaseDate(album.getReleaseDate())
                .songs(songResponses)
                .createdAt(album.getCreatedAt())
                .build();
    }
}
