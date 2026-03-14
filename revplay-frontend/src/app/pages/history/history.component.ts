import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../../services/other.services';
import { SongService } from '../../services/song.service';
import { History, Song } from '../../models/models';

@Component({
  selector: 'app-history',
  template: `
    <div class="history-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">🎧 Listening History</h1>
          <p class="page-subtitle">Songs you have listened to</p>
        </div>
        <button class="btn-danger" (click)="clearHistory()">Clear History</button>
      </div>

      <div *ngIf="loading" class="loading"><div class="spinner"></div></div>

      <div *ngIf="!loading">
        <div class="section" *ngIf="recent.length > 0">
          <h2 class="section-title">Recently Played</h2>
          <div class="history-list">
            <div class="history-item card" *ngFor="let item of recent">
              <div class="history-cover">🎵</div>
              <div class="history-info">
                <div class="history-title">Song #{{ item.songId }}</div>
                <div class="history-time">{{ formatDate(item.playedAt) }}</div>
              </div>
              <div class="history-duration" *ngIf="item.listenedDuration">
                {{ formatDuration(item.listenedDuration) }}
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="recent.length === 0">
          <div class="empty-icon">🎧</div>
          <h3>No listening history yet</h3>
          <p>Start listening to music and your history will appear here</p>
          <button class="btn-primary" routerLink="/library">Browse Music</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .history-page { max-width: 900px; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
    .section-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; color: var(--text-primary); }
    .history-list { display: flex; flex-direction: column; gap: 10px; }
    .history-item { display: flex; align-items: center; gap: 16px; padding: 14px 16px; }
    .history-cover {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }
    .history-info { flex: 1; }
    .history-title { font-weight: 600; font-size: 14px; }
    .history-time { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
    .history-duration { font-size: 12px; color: var(--text-muted); font-weight: 500; }
    .loading { display: flex; justify-content: center; padding: 60px; }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class HistoryComponent implements OnInit {
  recent: History[] = [];
  loading = true;

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.historyService.getRecentlyPlayed().subscribe({
      next: h => { this.recent = h; this.loading = false; },
      error: () => this.loading = false
    });
  }

  clearHistory(): void {
    if (confirm('Clear all listening history?')) {
      this.historyService.clearHistory().subscribe(() => this.recent = []);
    }
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}
