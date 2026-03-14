import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../../../services/artist.service';
import { SongService } from '../../../services/song.service';
import { AuthService } from '../../../services/auth.service';
import { AnalyticsService } from '../../../services/other.services';
import { Artist, Song } from '../../../models/models';

@Component({
  selector: 'app-artist-dashboard',
  template: `
    <div class="dashboard-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Artist Dashboard 🎹</h1>
          <p class="page-subtitle">Welcome back, {{ artist?.artistName || user?.username }}</p>
        </div>
        <button class="btn-primary" routerLink="/artist/upload">+ Upload Song</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🎵</div>
          <div class="stat-value">{{ songs.length }}</div>
          <div class="stat-label">Total Songs</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">▶️</div>
          <div class="stat-value">{{ totalPlays }}</div>
          <div class="stat-label">Total Plays</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💿</div>
          <div class="stat-value">{{ albums.length }}</div>
          <div class="stat-label">Albums</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">❤️</div>
          <div class="stat-value">{{ totalFavorites }}</div>
          <div class="stat-label">Favorites</div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <div class="section-header">
            <h2>Recent Songs</h2>
            <a routerLink="/artist/my-songs" class="view-all">View All →</a>
          </div>
          <div *ngIf="songs.length === 0" class="empty-small">No songs yet. Upload your first song!</div>
          <div class="song-list">
            <div class="song-row" *ngFor="let song of songs.slice(0, 5)">
              <div class="song-cover-sm">
                <img *ngIf="song.coverImage" [src]="song.coverImage" />
                <span *ngIf="!song.coverImage">🎵</span>
              </div>
              <div class="song-info-sm">
                <div class="song-title-sm">{{ song.title }}</div>
                <div class="song-meta-sm">{{ song.genre }} • {{ song.playCount || 0 }} plays</div>
              </div>
              <div class="song-actions-sm">
                <button class="action-btn" routerLink="/artist/my-songs">Edit</button>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div class="quick-actions">
            <a class="action-card" routerLink="/artist/upload">
              <div class="action-icon">⬆️</div>
              <div class="action-label">Upload Song</div>
            </a>
            <a class="action-card" routerLink="/artist/albums">
              <div class="action-icon">💿</div>
              <div class="action-label">Create Album</div>
            </a>
            <a class="action-card" routerLink="/artist/analytics">
              <div class="action-icon">📈</div>
              <div class="action-label">View Analytics</div>
            </a>
            <a class="action-card" routerLink="/artist/profile">
              <div class="action-icon">👤</div>
              <div class="action-label">Edit Profile</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page { max-width: 1200px; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; }
    .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px; }
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .section-header h2 { font-size: 16px; font-weight: 700; }
    .view-all { font-size: 13px; color: var(--primary); font-weight: 600; cursor: pointer; }
    .empty-small { font-size: 13px; color: var(--text-secondary); padding: 16px 0; }
    .song-list { display: flex; flex-direction: column; gap: 10px; }
    .song-row { display: flex; align-items: center; gap: 12px; padding: 8px; border-radius: var(--radius-sm); transition: background 0.15s; }
    .song-row:hover { background: var(--background); }
    .song-cover-sm { width: 40px; height: 40px; border-radius: 8px; background: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 16px; overflow: hidden; flex-shrink: 0; }
    .song-cover-sm img { width: 100%; height: 100%; object-fit: cover; }
    .song-info-sm { flex: 1; }
    .song-title-sm { font-weight: 600; font-size: 13px; }
    .song-meta-sm { font-size: 11px; color: var(--text-secondary); margin-top: 2px; }
    .action-btn { background: var(--accent); color: var(--primary-dark); border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
    .quick-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .action-card { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 20px; border-radius: var(--radius); border: 1.5px solid var(--border); cursor: pointer; transition: all 0.2s; text-decoration: none; }
    .action-card:hover { border-color: var(--primary); background: var(--accent); transform: translateY(-2px); }
    .action-icon { font-size: 28px; }
    .action-label { font-size: 13px; font-weight: 600; color: var(--text-primary); }
    @media (max-width: 768px) { .dashboard-grid { grid-template-columns: 1fr; } }
  `]
})
export class ArtistDashboardComponent implements OnInit {
  artist: Artist | null = null;
  songs: Song[] = [];
  albums: any[] = [];
  totalPlays = 0;
  totalFavorites = 0;
  user: any = null;

  constructor(
    private artistService: ArtistService,
    private songService: SongService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.artistService.getArtistByUserId(this.user.userId).subscribe({
        next: artist => {
          this.artist = artist;
          this.loadSongs();
          this.loadAlbums();
        },
        error: () => { this.loadSongs(); this.loadAlbums(); }
      });
    }
  }

  loadSongs(): void {
    if (!this.user) return;
    this.songService.getSongsByArtist(this.user.userId).subscribe({
      next: songs => {
        this.songs = songs;
        this.totalPlays = songs.reduce((sum, s) => sum + (s.playCount || 0), 0);
      },
      error: () => {}
    });
  }

  loadAlbums(): void {
    if (!this.user) return;
    this.songService.getAlbumsByArtist(this.user.userId).subscribe({
      next: albums => this.albums = albums,
      error: () => {}
    });
  }
}
