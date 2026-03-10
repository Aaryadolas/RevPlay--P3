package com.revplay.service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.revplay.dto.GenreRequest;
import com.revplay.dto.GenreResponse;
import com.revplay.entity.Genre;
import com.revplay.exception.ResourceNotFoundException;
import com.revplay.repository.GenreRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GenreService {

    private final GenreRepository genreRepository;

    public GenreResponse createGenre(GenreRequest request) {
        if (genreRepository.existsByNameIgnoreCase(request.getName())) {
            throw new RuntimeException("Genre already exists");
        }
        Genre genre = Genre.builder()
                .name(request.getName())
                .build();
        return mapToResponse(genreRepository.save(genre));
    }

    public List<GenreResponse> getAllGenres() {
        return genreRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteGenre(Long id) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Genre not found with id: " + id));
        genreRepository.delete(genre);
    }

    private GenreResponse mapToResponse(Genre genre) {
        return GenreResponse.builder()
                .id(genre.getId())
                .name(genre.getName())
                .build();
    }
}