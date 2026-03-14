import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Song, Genre, Album } from '../models/models';

@Injectable({ providedIn: 'root' })
export class SongService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllPublicSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/api/songs/public`);
  }

  getSongById(id: number): Observable<Song> {
    return this.http.get<Song>(`${this.apiUrl}/api/songs/public/${id}`);
  }

  searchSongs(title: string): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/api/songs/public/search?title=${title}`);
  }

  getSongsByGenre(genre: string): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/api/songs/public/genre/${genre}`);
  }

  getSongsByArtist(artistId: number): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/api/songs/public/artist/${artistId}`);
  }

  createSong(song: any): Observable<Song> {
    return this.http.post<Song>(`${this.apiUrl}/api/songs`, song);
  }

  updateSong(id: number, song: any): Observable<Song> {
    return this.http.put<Song>(`${this.apiUrl}/api/songs/${id}`, song);
  }

  deleteSong(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/api/songs/${id}`);
  }

  incrementPlayCount(id: number): Observable<Song> {
    return this.http.put<Song>(`${this.apiUrl}/api/songs/public/${id}/play`, {});
  }

  getAllGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.apiUrl}/api/genres`);
  }

  createGenre(genre: any): Observable<Genre> {
    return this.http.post<Genre>(`${this.apiUrl}/api/genres`, genre);
  }

  getAllPublicAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.apiUrl}/api/albums/public`);
  }

  getAlbumById(id: number): Observable<Album> {
    return this.http.get<Album>(`${this.apiUrl}/api/albums/public/${id}`);
  }

  getAlbumsByArtist(artistId: number): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.apiUrl}/api/albums/public/artist/${artistId}`);
  }

  createAlbum(album: any): Observable<Album> {
    return this.http.post<Album>(`${this.apiUrl}/api/albums`, album);
  }

  updateAlbum(id: number, album: any): Observable<Album> {
    return this.http.put<Album>(`${this.apiUrl}/api/albums/${id}`, album);
  }

  deleteAlbum(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/api/albums/${id}`);
  }
}
