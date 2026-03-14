import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../../services/other.services';
import { ArtistService } from '../../../services/artist.service';
import { SongService } from '../../../services/song.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-artist-analytics',
  template: `
    <div class="analytics-page">
      <h1 class="page-title">Analytics 📈</h1>
      <p class="page-subtitle">Track your music performance</p>

      <div *ngIf="loading" class="loading"><div class="spinner"></div></div>

      <div *ngIf="!loading">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🎵</div>
            <div class="stat-value">{{ totalSongs }}</div>
            <div class="stat-label">Total Songs</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">▶️</div>
            <div class="stat-value">{{ totalPlays }}</div>
            <div class="stat-label">Total Plays</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💿</div>
            <div class="stat-value">{{ totalAlbums }}</div>
            <div class="stat-label">Albums</div>
          </div>
        </div>

        <div class="analytics-grid">
          <div class="card">
            <h2 class="section-title">Top Songs by Plays</h2>
            <div class="empty-small" *ngIf="songs.length === 0">No songs yet</div>
            <div class="top-songs">
              <div class="top-song-row" *ngFor="let song of topSongs; let i = index">
                <div class="rank">{{ i + 1 }}</div>
                <div class="song-cover-sm">
                  <img *ngIf="song.coverImage" [src]="song.coverImage" />
                  <span *ngIf="!song.coverImage">🎵</span>
                </div>
                <div class="song-info-sm">
                  <div class="song-title-sm">{{ song.title }}</div>
                  <div class="song-meta-sm">{{ song.genre }}</div>
                </div>
                <div class="play-count">{{ song.playCount || 0 }} plays</div>
                <div class="play-bar">
                  <div class="play-fill" [style.width.%]="getPlayPercent(song.playCount)"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <h2 class="section-title">Song Performance</h2>
            <div class="perf-table">
              <div class="perf-header">
                <span>Song</span>
                <span>Plays</span>
                <span>Genre</span>
              </div>
              <div class="perf-row" *ngFor="let song of songs">
                <span class="perf-title">{{ song.title }}</span>
                <span class="perf-plays">{{ song.playCount || 0 }}</span>
                <span class="badge">{{ song.genre }}</span>
              </div>
              <div class="empty-small" *ngIf="songs.length === 0">No data available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-page { max-width: 1100px; }
    .analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px; }
    .section-title { font-size: 16px; font-weight: 700; margin-bottom: 20px; }
    .top-songs { display: flex; flex-direction: column; gap: 12px; }
    .top-song-row { display: flex; align-items: center; gap: 10px; }
    .rank { font-size: 13px; font-weight: 700; color: var(--primary); min-width: 20px; }
    .song-cover-sm { width: 36px; height: 36px; border-radius: 6px; background: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 14px; overflow: hidden; flex-shrink: 0; }
    .song-cover-sm img { width: 100%; height: 100%; object-fit: cover; }
    .song-info-sm { flex: 1; min-width: 0; }
    .song-title-sm { font-weight: 600; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .song-meta-sm { font-size: 11px; color: var(--text-secondary); }
    .play-count { font-size: 12px; font-weight: 600; color: var(--primary); min-width: 60px; text-align: right; }
    .play-bar { width: 60px; height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }
    .play-fill { height: 100%; background: var(--primary); border-radius: 2px; }
    .perf-table { display: flex; flex-direction: column; gap: 0; }
    .perf-header { display: grid; grid-template-columns: 1fr auto auto; gap: 12px; padding: 8px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); border-bottom: 1px solid var(--border); margin-bottom: 8px; }
    .perf-row { display: grid; grid-template-columns: 1fr auto auto; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); align-items: center; font-size: 13px; }
    .perf-row:last-child { border-bottom: none; }
    .perf-title { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .perf-plays { font-weight: 700; color: var(--primary); }
    .empty-small { font-size: 13px; color: var(--text-secondary); padding: 16px 0; }
    .loading { display: flex; justify-content: center; padding: 60px; }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 768px) { .analytics-grid { grid-template-columns: 1fr; } }
  `]
})
export class ArtistAnalyticsComponent implements OnInit {
  songs: any[] = [];
  topSongs: any[] = [];
  totalSongs = 0;
  totalPlays = 0;
  totalAlbums = 0;
  loading = true;

  constructor(
    private songService: SongService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.songService.getSongsByArtist(user.userId).subscribe({
        next: songs => {
          this.songs = songs;
          this.totalSongs = songs.length;
          this.totalPlays = songs.reduce((sum, s) => sum + (s.playCount || 0), 0);
          this.topSongs = [...songs].sort((a, b) => (b.playCount || 0) - (a.playCount || 0)).slice(0, 5);
          this.loading = false;
        },
        error: () => this.loading = false
      });
      this.songService.getAlbumsByArtist(user.userId).subscribe({
        next: albums => this.totalAlbums = albums.length,
        error: () => {}
      });
    }
  }

  getPlayPercent(plays?: number): number {
    if (!plays || this.totalPlays === 0) return 0;
    const max = Math.max(...this.songs.map(s => s.playCount || 0));
    return max > 0 ? (plays / max) * 100 : 0;
  }
}
