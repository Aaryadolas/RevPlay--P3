import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../../services/other.services';
import { SongService } from '../../services/song.service';
import { Song, Favorite } from '../../models/models';

@Component({
  selector: 'app-favorites',
  template: `
    <div class="favorites-page">
      <h1 class="page-title">Your Favorite Songs ❤️</h1>
      <p class="page-subtitle">Songs you have loved</p>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div class="empty-state" *ngIf="!loading && favorites.length === 0">
        <div class="empty-icon">💔</div>
        <h3>No favorite songs yet</h3>
        <p>Start adding songs to your favorites by clicking the heart icon</p>
        <button class="btn-primary" routerLink="/library">Browse Music</button>
      </div>

      <div class="songs-grid" *ngIf="!loading && favorites.length > 0">
        <div class="fav-item card" *ngFor="let fav of favorites">
          <div class="fav-cover">
            <img *ngIf="getSong(fav.songId)?.coverImage" [src]="getSong(fav.songId)?.coverImage" />
            <span *ngIf="!getSong(fav.songId)?.coverImage">🎵</span>
          </div>
          <div class="fav-info">
            <div class="fav-title">{{ getSong(fav.songId)?.title || 'Song #' + fav.songId }}</div>
            <div class="fav-genre">{{ getSong(fav.songId)?.genre }}</div>
          </div>
          <button class="remove-btn" (click)="removeFavorite(fav.songId)">✕</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .favorites-page { max-width: 900px; }
    .songs-grid { display: flex; flex-direction: column; gap: 12px; }
    .fav-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
    }
    .fav-cover {
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
    .fav-cover img { width: 100%; height: 100%; object-fit: cover; }
    .fav-info { flex: 1; }
    .fav-title { font-weight: 600; font-size: 14px; }
    .fav-genre { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
    .remove-btn {
      background: #FEE2E2;
      color: #EF4444;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s;
    }
    .remove-btn:hover { background: #EF4444; color: white; }
    .loading { display: flex; justify-content: center; padding: 60px; }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class FavoritesComponent implements OnInit {
  favorites: Favorite[] = [];
  songsMap: Map<number, Song> = new Map();
  loading = true;

  constructor(private favoriteService: FavoriteService, private songService: SongService) {}

  ngOnInit(): void {
    this.favoriteService.getMyFavorites().subscribe({
      next: favs => {
        this.favorites = favs;
        this.loadSongs(favs.map(f => f.songId));
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadSongs(ids: number[]): void {
    ids.forEach(id => {
      this.songService.getSongById(id).subscribe({
        next: song => this.songsMap.set(id, song),
        error: () => {}
      });
    });
  }

  getSong(id: number): Song | undefined {
    return this.songsMap.get(id);
  }

  removeFavorite(songId: number): void {
    this.favoriteService.removeFavorite(songId).subscribe(() => {
      this.favorites = this.favorites.filter(f => f.songId !== songId);
    });
  }
}
