import { Component, OnInit } from '@angular/core';
import { PlaylistService } from '../../services/other.services';
import { Playlist } from '../../models/models';

@Component({
  selector: 'app-explore',
  template: `
    <div class="explore-page">
      <h1 class="page-title">🌍 Public Playlists</h1>
      <p class="page-subtitle">Discover playlists from the community</p>

      <div *ngIf="loading" class="loading"><div class="spinner"></div></div>

      <div class="playlists-grid" *ngIf="!loading && paginatedPlaylists.length > 0">
        <div class="playlist-card card" *ngFor="let playlist of paginatedPlaylists">
          <div class="playlist-cover">🎶</div>
          <div class="playlist-name">{{ playlist.name }}</div>
          <div class="playlist-meta">{{ playlist.totalSongs || 0 }} songs</div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && playlists.length === 0">
        <div class="empty-icon">🌍</div>
        <h3>No public playlists yet</h3>
        <p>Be the first to create a public playlist</p>
      </div>

      <div class="pagination" *ngIf="totalPages > 1">
        <button class="btn-secondary" [disabled]="currentPage === 1" (click)="prevPage()">Previous</button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button class="btn-primary" [disabled]="currentPage === totalPages" (click)="nextPage()">Next</button>
      </div>
    </div>
  `,
  styles: [`
    .explore-page { max-width: 1200px; }
    .playlists-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .playlist-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 16px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .playlist-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
    .playlist-cover { font-size: 40px; margin-bottom: 12px; }
    .playlist-name { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
    .playlist-meta { font-size: 12px; color: var(--text-secondary); }
    .loading { display: flex; justify-content: center; padding: 60px; }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ExploreComponent implements OnInit {
  playlists: Playlist[] = [];
  paginatedPlaylists: Playlist[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 12;
  totalPages = 1;

  constructor(private playlistService: PlaylistService) {}

  ngOnInit(): void {
    this.playlistService.getPublicPlaylists().subscribe({
      next: p => {
        this.playlists = p;
        this.totalPages = Math.ceil(p.length / this.pageSize);
        this.updatePagination();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedPlaylists = this.playlists.slice(start, start + this.pageSize);
  }

  prevPage(): void { if (this.currentPage > 1) { this.currentPage--; this.updatePagination(); } }
  nextPage(): void { if (this.currentPage < this.totalPages) { this.currentPage++; this.updatePagination(); } }
}
