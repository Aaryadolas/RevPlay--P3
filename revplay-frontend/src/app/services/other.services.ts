import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Playlist, Favorite, History } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  createPlaylist(playlist: any): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.apiUrl}/api/playlists`, playlist);
  }

  getPlaylistById(id: number): Observable<Playlist> {
    return this.http.get<Playlist>(`${this.apiUrl}/api/playlists/${id}`);
  }

  getMyPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.apiUrl}/api/playlists/user`);
  }

  getPublicPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.apiUrl}/api/playlists/public`);
  }

  updatePlaylist(id: number, playlist: any): Observable<Playlist> {
    return this.http.put<Playlist>(`${this.apiUrl}/api/playlists/${id}`, playlist);
  }

  deletePlaylist(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/api/playlists/${id}`);
  }

  addSongToPlaylist(playlistId: number, songId: number): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.apiUrl}/api/playlists/${playlistId}/songs`, { songId });
  }

  removeSongFromPlaylist(playlistId: number, songId: number): Observable<Playlist> {
    return this.http.delete<Playlist>(`${this.apiUrl}/api/playlists/${playlistId}/songs/${songId}`);
  }
}

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  addFavorite(songId: number): Observable<Favorite> {
    return this.http.post<Favorite>(`${this.apiUrl}/api/favorites`, { songId });
  }

  removeFavorite(songId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/api/favorites/song/${songId}`);
  }

  getMyFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}/api/favorites/user`);
  }

  isFavorited(songId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/api/favorites/check/song/${songId}`);
  }

  getFavoriteCount(songId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/favorites/public/song/${songId}/count`);
  }
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  recordPlay(songId: number, listenedDuration: number): Observable<History> {
    return this.http.post<History>(`${this.apiUrl}/api/history`, { songId, listenedDuration });
  }

  getMyHistory(): Observable<History[]> {
    return this.http.get<History[]>(`${this.apiUrl}/api/history/user`);
  }

  getRecentlyPlayed(): Observable<History[]> {
    return this.http.get<History[]>(`${this.apiUrl}/api/history/user/recent`);
  }

  clearHistory(): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/api/history/user/clear`);
  }

  getTotalListeningTime(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/api/history/user/listening-time`);
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  recordPlay(songId: number, artistId: number, listenedDuration: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/analytics/play`, { songId, artistId, listenedDuration });
  }

  getArtistDashboard(artistId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/analytics/dashboard/artist/${artistId}`);
  }

  getDailyPlays(artistId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/analytics/trends/daily/artist/${artistId}`);
  }

  getWeeklyPlays(artistId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/analytics/trends/weekly/artist/${artistId}`);
  }

  getMonthlyPlays(artistId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/analytics/trends/monthly/artist/${artistId}`);
  }

  getTotalPlaysForSong(songId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/api/analytics/public/songs/${songId}/plays`);
  }
}
