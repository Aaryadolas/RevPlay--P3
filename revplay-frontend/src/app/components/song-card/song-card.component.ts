import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Song } from '../../models/models';
import { PlayerService } from '../../services/player.service';
import { FavoriteService } from '../../services/other.services';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-song-card',
  template: `
    <div class="song-card" [class.playing]="isCurrentlyPlaying">
      <div class="card-image">
        <img *ngIf="song.coverImage"
          [src]="song.coverImage"
          [alt]="song.title"
          (error)="onImageError($event)" />
        <div *ngIf="!song.coverImage" class="cover-placeholder">
          🎵
        </div>
        <div class="card-overlay">
          <button class="fav-btn"
            (click)="onFavorite($event)"
            [class.favorited]="isFav">♥</button>
        </div>
        <button class="play-btn" (click)="onPlay()">
          {{ isCurrentlyPlaying && isPlaying ? '⏸' : '▶' }}
        </button>
      </div>
      <div class="card-info">
        <div class="song-title" (click)="onPlay()">
          {{ song.title }}
        </div>
        <div class="song-meta">
          <span class="artist-name">
            {{ song.artistName || 'Artist' }}
          </span>
          <span class="genre-badge">{{ song.genre }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .song-card {
      background: var(--card);
      border-radius: var(--radius);
      overflow: hidden;
      border: 1px solid var(--border);
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .song-card:hover {
      box-shadow: var(--shadow-hover);
      transform: translateY(-2px);
    }
    .song-card.playing {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(139,92,246,0.2);
    }
    .card-image {
      position: relative;
      aspect-ratio: 1;
      overflow: hidden;
      background: var(--accent);
    }
    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .cover-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      background: linear-gradient(135deg,
        var(--accent), var(--primary-light));
    }
    .card-overlay {
      position: absolute;
      top: 8px;
      right: 8px;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .song-card:hover .card-overlay { opacity: 1; }
    .fav-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: none;
      background: rgba(255,255,255,0.9);
      font-size: 14px;
      cursor: pointer;
      color: #9CA3AF;
      transition: all 0.15s;
    }
    .fav-btn.favorited { color: #EF4444; }
    .fav-btn:hover { color: #EF4444; }
    .play-btn {
      position: absolute;
      bottom: 8px;
      right: 8px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      border: none;
      font-size: 18px;
      cursor: pointer;
      opacity: 0;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(139,92,246,0.4);
    }
    .song-card:hover .play-btn { opacity: 1; }
    .play-btn:hover {
      background: var(--primary-dark);
      transform: scale(1.05);
    }
    .card-info { padding: 12px; }
    .song-title {
      font-weight: 600;
      font-size: 14px;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 4px;
    }
    .song-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .artist-name {
      font-size: 12px;
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .genre-badge {
      font-size: 10px;
      font-weight: 600;
      background: var(--accent);
      color: var(--primary-dark);
      padding: 2px 8px;
      border-radius: 10px;
      white-space: nowrap;
      text-transform: uppercase;
    }
  `]
})
export class SongCardComponent implements OnInit {
  @Input() song!: Song;
  @Input() queue: Song[] = [];
  @Output() addToPlaylist = new EventEmitter<Song>();

  isFav = false;
  isCurrentlyPlaying = false;
  isPlaying = false;

  constructor(
    private playerService: PlayerService,
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.playerService.currentSong$.subscribe(s => {
      this.isCurrentlyPlaying = s?.id === this.song?.id;
    });
    this.playerService.isPlaying$.subscribe(p => {
      this.isPlaying = p;
    });
  }

  onPlay(): void {
    console.log('onPlay clicked, song:', this.song);
    if (!this.song) return;

    if (this.isCurrentlyPlaying) {
      this.playerService.togglePlay();
    } else {
      const q = this.queue.length ? this.queue : [this.song];
      this.playerService.playSong(this.song, q);
    }
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

  onFavorite(event: Event): void {
    event.stopPropagation();
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.isFav) {
      this.favoriteService.removeFavorite(
        this.song.id!
      ).subscribe(() => this.isFav = false);
    } else {
      this.favoriteService.addFavorite(
        this.song.id!
      ).subscribe(() => this.isFav = true);
    }
  }
}