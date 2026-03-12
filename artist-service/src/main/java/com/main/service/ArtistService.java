package com.main.service;



import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.main.dto.ArtistResponse;
import com.main.dto.CreateArtistRequest;
import com.main.dto.SocialLinksRequest;
import com.main.dto.SocialLinksResponse;
import com.main.dto.UpdateArtistRequest;
import com.main.entity.Artist;
import com.main.entity.ArtistSocialLinks;
import com.main.exception.ArtistAlreadyExistsException;
import com.main.exception.ResourceNotFoundException;
import com.main.repository.ArtistRepository;
import com.main.repository.ArtistSocialLinksRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArtistService {

    private final ArtistRepository artistRepository;
    private final ArtistSocialLinksRepository socialLinksRepository;

    public ArtistResponse createArtist(CreateArtistRequest request) {

        if (artistRepository.existsByUserId(request.getUserId())) {
            throw new ArtistAlreadyExistsException(
                "Artist profile already exists for this user");
        }

        Artist artist = Artist.builder()
                .userId(request.getUserId())
                .artistName(request.getArtistName())
                .bio(request.getBio())
                .genre(request.getGenre())
                .profilePicture(request.getProfilePicture())
                .bannerImage(request.getBannerImage())
                .isActive(true)
                .build();

        Artist saved = artistRepository.save(artist);
        return mapToResponse(saved, null);
    }

    public ArtistResponse getArtistById(Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Artist not found with id: " + id));

        ArtistSocialLinks links = socialLinksRepository
                .findByArtistId(id).orElse(null);

        return mapToResponse(artist, links);
    }

    public ArtistResponse getArtistByUserId(Long userId) {
        Artist artist = artistRepository.findByUserId(userId)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Artist not found for userId: " + userId));

        ArtistSocialLinks links = socialLinksRepository
                .findByArtistId(artist.getId()).orElse(null);

        return mapToResponse(artist, links);
    }

    public List<ArtistResponse> getAllArtists() {
        return artistRepository.findAll()
                .stream()
                .map(artist -> {
                    ArtistSocialLinks links = socialLinksRepository
                            .findByArtistId(artist.getId()).orElse(null);
                    return mapToResponse(artist, links);
                })
                .collect(Collectors.toList());
    }

    public ArtistResponse updateArtist(Long id,
                                       UpdateArtistRequest request) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Artist not found with id: " + id));

        if (request.getArtistName() != null)
            artist.setArtistName(request.getArtistName());
        if (request.getBio() != null)
            artist.setBio(request.getBio());
        if (request.getGenre() != null)
            artist.setGenre(request.getGenre());
        if (request.getProfilePicture() != null)
            artist.setProfilePicture(request.getProfilePicture());
        if (request.getBannerImage() != null)
            artist.setBannerImage(request.getBannerImage());

        Artist updated = artistRepository.save(artist);
        ArtistSocialLinks links = socialLinksRepository
                .findByArtistId(id).orElse(null);

        return mapToResponse(updated, links);
    }

    public ArtistResponse updateSocialLinks(Long artistId,
                                            SocialLinksRequest request) {
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Artist not found with id: " + artistId));

        ArtistSocialLinks links = socialLinksRepository
                .findByArtistId(artistId)
                .orElse(ArtistSocialLinks.builder()
                        .artist(artist)
                        .build());

        if (request.getInstagram() != null)
            links.setInstagram(request.getInstagram());
        if (request.getTwitter() != null)
            links.setTwitter(request.getTwitter());
        if (request.getYoutube() != null)
            links.setYoutube(request.getYoutube());
        if (request.getSpotify() != null)
            links.setSpotify(request.getSpotify());
        if (request.getWebsite() != null)
            links.setWebsite(request.getWebsite());

        ArtistSocialLinks savedLinks = socialLinksRepository.save(links);
        return mapToResponse(artist, savedLinks);
    }

    public void deleteArtist(Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Artist not found with id: " + id));
        socialLinksRepository.findByArtistId(id)
                .ifPresent(socialLinksRepository::delete);
        artistRepository.delete(artist);
    }

    private ArtistResponse mapToResponse(Artist artist,
                                          ArtistSocialLinks links) {
        SocialLinksResponse socialLinksResponse = null;

        if (links != null) {
            socialLinksResponse = SocialLinksResponse.builder()
                    .instagram(links.getInstagram())
                    .twitter(links.getTwitter())
                    .youtube(links.getYoutube())
                    .spotify(links.getSpotify())
                    .website(links.getWebsite())
                    .build();
        }

        return ArtistResponse.builder()
                .id(artist.getId())
                .userId(artist.getUserId())
                .artistName(artist.getArtistName())
                .bio(artist.getBio())
                .genre(artist.getGenre())
                .profilePicture(artist.getProfilePicture())
                .bannerImage(artist.getBannerImage())
                .socialLinks(socialLinksResponse)
                .createdAt(artist.getCreatedAt())
                .build();
    }
}
