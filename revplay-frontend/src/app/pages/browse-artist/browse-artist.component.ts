import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../../services/artist.service';
import { SongService } from '../../services/song.service';
import { Artist, Song } from '../../models/models';

@Component({
  selector: 'app-browse-artist',
  template: `
    <div class="browse-page">
      <h1 class="page-title">Browse by Artist 🎤</h1>
      <p class="page-subtitle">Select an artist to view their songs</p>

      <div class="select-row">
        <select class="input-field artist-select"
          [(ngModel)]="selectedArtistId"
          (change)="loadArtistSongs()">
          <option value="">Select Artist</option>
          <option *ngFor="let artist of artists" [value]="artist.id">
            {{ artist.artistName }}
          </option>
        </select>
        <button class="btn-primary"
          (click)="loadArtistSongs()"
          [disabled]="!selectedArtistId">
          Browse
        </button>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div *ngIf="!loading && songs.length > 0">
        <h2 class="section-header">{{ getArtistName() }}'s Songs</h2>
        <div class="songs-grid">
          <div class="song-item card"
            *ngFor="let song of songs">
            <div class="song-cover">
              <img *ngIf="song.coverImage" [src]="song.coverImage" />
              <span *ngIf="!song.coverImage">🎵</span>
            </div>
            <div class="song-info">
              <div class="song-title">{{ song.title }}</div>
              <div class="song-genre badge">{{ song.genre }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state"
        *ngIf="!loading && selectedArtistId && songs.length === 0">
        <div class="empty-icon">🎵</div>
        <h3>No songs from this artist yet</h3>
      </div>
    </div>
  `,
  styles: [`
    .browse-page { max-width: 1200px; }
    .select-row {
      display: flex;
      gap: 12px;
      margin-bottom: 32px;
      align-items: center;
    }
    .artist-select { flex: 1; max-width: 500px; }
    .section-header {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .songs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }
    .song-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
    }
    .song-cover {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      background: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      overflow: hidden;
      flex-shrink: 0;
    }
    .song-cover img { width: 100%; height: 100%; object-fit: cover; }
    .song-info { flex: 1; }
    .song-title {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 4px;
    }
    .loading { display: flex; justify-content: center; padding: 60px; }
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class BrowseArtistComponent implements OnInit {
  artists: Artist[] = [];
  songs: Song[] = [];
  selectedArtistId: any = '';
  loading = false;

  constructor(
    private artistService: ArtistService,
    private songService: SongService
  ) {}

  ngOnInit(): void {
    this.artistService.getAllArtists().subscribe({
      next: a => this.artists = a,
      error: () => {}
    });
  }

  loadArtistSongs(): void {
    if (!this.selectedArtistId) return;
    this.loading = true;
    this.songService.getSongsByArtist(
      this.selectedArtistId
    ).subscribe({
      next: s => { this.songs = s; this.loading = false; },
      error: () => this.loading = false
    });
  }

  getArtistName(): string {
    const artist = this.artists.find(
      a => a.id == this.selectedArtistId
    );
    return artist?.artistName || '';
  }
}