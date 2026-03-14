import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { PlayerService } from '../../services/player.service';
import { Song } from '../../models/models';

@Component({
  selector: 'app-player',
  template: `
    <div class="player-bar">
      <div class="player-song-info">
        <div class="song-cover" *ngIf="currentSong?.coverImage">
          <img [src]="currentSong?.coverImage" [alt]="currentSong?.title" />
        </div>
        <div class="song-cover-placeholder" *ngIf="!currentSong?.coverImage">🎵</div>
        <div class="song-details">
          <div class="song-title">{{ currentSong?.title || 'No Song Playing' }}</div>
          <div class="song-artist">{{ currentSong?.artistName || 'Select a song' }}</div>
        </div>
      </div>

      <div class="player-controls">
        <div class="control-buttons">
          <button class="ctrl-btn" (click)="previous()">⏮</button>
          <button class="ctrl-btn play-btn" (click)="togglePlay()">
            {{ isPlaying ? '⏸' : '▶' }}
          </button>
          <button class="ctrl-btn" (click)="next()">⏭</button>
        </div>
        <div class="progress-bar-wrapper">
          <span class="time">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar" (click)="seek($event)">
            <div class="progress-fill" [style.width.%]="progressPercent"></div>
          </div>
          <span class="time">{{ formatTime(duration) }}</span>
        </div>
      </div>

      <div class="player-volume">
        <span>🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          [(ngModel)]="volume"
          (input)="setVolume()"
          class="volume-slider"
        />
      </div>
    </div>
  `,
  styles: [`
    .player-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 90px;
      background: var(--card);
      border-top: 1px solid var(--border);
      display: flex;
      align-items: center;
      padding: 0 24px;
      gap: 24px;
      z-index: 200;
      box-shadow: 0 -4px 24px rgba(139,92,246,0.08);
    }
    .player-song-info {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 220px;
    }
    .song-cover {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      overflow: hidden;
    }
    .song-cover img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .song-cover-placeholder {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      background: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    .song-title {
      font-weight: 600;
      font-size: 14px;
      color: var(--text-primary);
    }
    .song-artist {
      font-size: 12px;
      color: var(--text-secondary);
    }
    .player-controls {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .control-buttons {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .ctrl-btn {
      background: transparent;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: var(--text-secondary);
      transition: all 0.2s;
      padding: 4px;
    }
    .ctrl-btn:hover { color: var(--primary); }
    .play-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary);
      color: white !important;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .play-btn:hover { background: var(--primary-dark) !important; }
    .progress-bar-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      max-width: 500px;
    }
    .time {
      font-size: 11px;
      color: var(--text-muted);
      min-width: 35px;
    }
    .progress-bar {
      flex: 1;
      height: 4px;
      background: var(--border);
      border-radius: 2px;
      cursor: pointer;
      position: relative;
    }
    .progress-fill {
      height: 100%;
      background: var(--primary);
      border-radius: 2px;
      transition: width 0.1s;
    }
    .player-volume {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 140px;
    }
    .volume-slider {
      width: 90px;
      accent-color: var(--primary);
      cursor: pointer;
    }
  `]
})
export class PlayerComponent implements OnInit, OnDestroy {
  currentSong: Song | null = null;
  isPlaying = false;
  volume = 1;
  currentTime = 0;
  duration = 0;
  progressPercent = 0;
  private subs: Subscription[] = [];
  private ticker?: Subscription;

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    this.subs.push(
      this.playerService.currentSong$.subscribe(song => this.currentSong = song),
      this.playerService.isPlaying$.subscribe(playing => {
        this.isPlaying = playing;
        if (playing) this.startTicker();
        else this.stopTicker();
      }),
      this.playerService.volume$.subscribe(vol => this.volume = vol)
    );
  }

  togglePlay(): void { this.playerService.togglePlay(); }
  next(): void { this.playerService.next(); }
  previous(): void { this.playerService.previous(); }

  setVolume(): void { this.playerService.setVolume(this.volume); }

  seek(event: MouseEvent): void {
    const bar = event.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    this.playerService.seekTo(percent * this.duration);
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  private startTicker(): void {
    this.stopTicker();
    this.ticker = interval(500).subscribe(() => {
      this.currentTime = this.playerService.getCurrentTime();
      this.duration = this.playerService.getDuration();
      this.progressPercent = this.duration ? (this.currentTime / this.duration) * 100 : 0;
    });
  }

  private stopTicker(): void {
    this.ticker?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.stopTicker();
  }
}
