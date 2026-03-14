import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Artist } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ArtistService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllArtists(): Observable<Artist[]> {
    return this.http.get<Artist[]>(`${this.apiUrl}/api/artists/public`);
  }

  getArtistById(id: number): Observable<Artist> {
    return this.http.get<Artist>(`${this.apiUrl}/api/artists/public/${id}`);
  }

  getArtistByUserId(userId: number): Observable<Artist> {
    return this.http.get<Artist>(`${this.apiUrl}/api/artists/public/user/${userId}`);
  }

  createArtist(artist: any): Observable<Artist> {
    return this.http.post<Artist>(`${this.apiUrl}/api/artists`, artist);
  }

  updateArtist(id: number, artist: any): Observable<Artist> {
    return this.http.put<Artist>(`${this.apiUrl}/api/artists/${id}`, artist);
  }

  updateSocialLinks(id: number, links: any): Observable<Artist> {
    return this.http.put<Artist>(`${this.apiUrl}/api/artists/${id}/social-links`, links);
  }

  deleteArtist(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/api/artists/${id}`);
  }
}
