package com.revplay.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.revplay.dto.CreateSongRequest;
import com.revplay.dto.SongResponse;
import com.revplay.dto.UpdateSongRequest;
import com.revplay.entity.Album;
import com.revplay.entity.Song;
import com.revplay.entity.Visibility;
import com.revplay.exception.ResourceNotFoundException;
import com.revplay.repository.AlbumRepository;
import com.revplay.repository.SongRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;
    private final AlbumRepository albumRepository;

    public SongResponse createSong(CreateSongRequest request) {
        Album album = null;
        if (request.getAlbumId() != null) {
            album = albumRepository.findById(request.getAlbumId())
                    .orElseThrow(() ->
                        new ResourceNotFoundException(
                            "Album not found with id: "
                            + request.getAlbumId()));
        }

        Visibility visibility = Visibility.PUBLIC;
        if (request.getVisibility() != null &&
                request.getVisibility().equalsIgnoreCase("UNLISTED")) {
            visibility = Visibility.UNLISTED;
        }

        Song song = Song.builder()
                .title(request.getTitle())
                .artistId(request.getArtistId())
                .album(album)
                .genre(request.getGenre())
                .duration(request.getDuration())
                .audioUrl(request.getAudioUrl())
                .coverImage(request.getCoverImage())
                .releaseDate(request.getReleaseDate() != null
                        ? LocalDate.parse(request.getReleaseDate())
                        : null)
                .visibility(visibility)
                .playCount(0L)
                .build();

        return mapToResponse(songRepository.save(song));
    }

    public SongResponse getSongById(Long id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Song not found with id: " + id));
        return mapToResponse(song);
    }

    public List<SongResponse> getAllPublicSongs() {
        return songRepository.findByVisibility(Visibility.PUBLIC)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<SongResponse> getSongsByArtist(Long artistId) {
        return songRepository.findByArtistId(artistId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<SongResponse> searchSongsByTitle(String title) {
        return songRepository
                .findByTitleContainingIgnoreCase(title)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<SongResponse> getSongsByGenre(String genre) {
        return songRepository.findByGenreIgnoreCase(genre)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public SongResponse updateSong(Long id, UpdateSongRequest request) {
        Song song = songRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Song not found with id: " + id));

        if (request.getTitle() != null)
            song.setTitle(request.getTitle());
        if (request.getGenre() != null)
            song.setGenre(request.getGenre());
        if (request.getDuration() != null)
            song.setDuration(request.getDuration());
        if (request.getAudioUrl() != null)
            song.setAudioUrl(request.getAudioUrl());
        if (request.getCoverImage() != null)
            song.setCoverImage(request.getCoverImage());
        if (request.getReleaseDate() != null)
            song.setReleaseDate(LocalDate.parse(request.getReleaseDate()));
        if (request.getVisibility() != null)
            song.setVisibility(Visibility.valueOf(
                request.getVisibility().toUpperCase()));

        return mapToResponse(songRepository.save(song));
    }

    public void deleteSong(Long id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Song not found with id: " + id));
        songRepository.delete(song);
    }

    public SongResponse incrementPlayCount(Long id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Song not found with id: " + id));
        song.setPlayCount(song.getPlayCount() + 1);
        return mapToResponse(songRepository.save(song));
    }

    public SongResponse mapToResponse(Song song) {
        return SongResponse.builder()
                .id(song.getId())
                .title(song.getTitle())
                .artistId(song.getArtistId())
                .albumId(song.getAlbum() != null
                        ? song.getAlbum().getId() : null)
                .albumName(song.getAlbum() != null
                        ? song.getAlbum().getAlbumName() : null)
                .genre(song.getGenre())
                .duration(song.getDuration())
                .audioUrl(song.getAudioUrl())
                .coverImage(song.getCoverImage())
                .releaseDate(song.getReleaseDate())
                .visibility(song.getVisibility().name())
                .playCount(song.getPlayCount())
                .createdAt(song.getCreatedAt())
                .build();
    }
}
