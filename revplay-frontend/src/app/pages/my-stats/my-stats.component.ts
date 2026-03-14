import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../../services/other.services';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-stats',
  template: `
    <div class="stats-page">
      <h1 class="page-title">My Account Statistics 📊</h1>
      <p class="page-subtitle">Your personal listening stats</p>

      <div *ngIf="loading" class="loading"><div class="spinner"></div></div>

      <div *ngIf="!loading">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🎵</div>
            <div class="stat-value">{{ totalPlays }}</div>
            <div class="stat-label">Total Plays</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-value">{{ formatTime(totalListeningTime) }}</div>
            <div class="stat-label">Total Listening Time</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🎶</div>
            <div class="stat-value">{{ uniqueSongs }}</div>
            <div class="stat-label">Unique Songs</div>
          </div>
        </div>

        <div class="card" style="margin-top: 24px;">
          <h2 style="font-size: 18px; margin-bottom: 16px;">Account Info</h2>
          <div class="info-row">
            <span class="info-label">Username</span>
            <span class="info-value">{{ user?.username }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email</span>
            <span class="info-value">{{ user?.email }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Role</span>
            <span class="badge">{{ user?.role }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-page { max-width: 900px; }
    .stat-card { text-align: center; }
    .stat-icon { font-size: 32px; margin-bottom: 12px; }
    .info-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid var(--border);
    }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-size: 13px; color: var(--text-secondary); font-weight: 500; }
    .info-value { font-size: 14px; font-weight: 600; }
    .loading { display: flex; justify-content: center; padding: 60px; }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class MyStatsComponent implements OnInit {
  loading = true;
  totalPlays = 0;
  totalListeningTime = 0;
  uniqueSongs = 0;
  user: any = null;

  constructor(private historyService: HistoryService, private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.historyService.getTotalListeningTime().subscribe({
      next: time => { this.totalListeningTime = time; this.loading = false; },
      error: () => this.loading = false
    });
    this.historyService.getMyHistory().subscribe({
      next: h => {
        this.totalPlays = h.length;
        const uniqueIds = new Set(h.map(item => item.songId));
        this.uniqueSongs = uniqueIds.size;
      },
      error: () => {}
    });
  }

  formatTime(seconds: number): string {
    if (!seconds) return '0m';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }
}
