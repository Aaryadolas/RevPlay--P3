import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SongService } from '../../services/song.service';
import { Song, Genre } from '../../models/models';

@Component({
  selector: 'app-library',
  template: `
    <div class="library-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Music Library</h1>
          <p class="page-subtitle">Discover and stream amazing music</p>
        </div>
      </div>

      <div class="filters">
        <select class="filter-select" [(ngModel)]="selectedGenre" (change)="applyFilters()">
          <option value="">All Genres</option>
          <option *ngFor="let genre of genres" [value]="genre.name">{{ genre.name }}</option>
        </select>
        <select class="filter-select" [(ngModel)]="sortOrder" (change)="applyFilters()">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="plays">Most Played</option>
        </select>
        <button class="btn-secondary" (click)="clearFilters()">Clear</button>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading songs...</p>
      </div>

      <div class="songs-grid" *ngIf="!loading && filteredSongs.length > 0">
        <app-song-card
          *ngFor="let song of paginatedSongs"
          [song]="song"
          [queue]="filteredSongs"
        ></app-song-card>
      </div>

      <div class="empty-state" *ngIf="!loading && filteredSongs.length === 0">
        <div class="empty-icon">🎵</div>
        <h3>No songs found</h3>
        <p>Try adjusting your filters or search query</p>
      </div>

      <div class="pagination" *ngIf="totalPages > 1">
        <button class="btn-secondary" [disabled]="currentPage === 1" (click)="prevPage()">Previous</button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button class="btn-primary" [disabled]="currentPage === totalPages" (click)="nextPage()">Next</button>
      </div>
    </div>
  `,
  styles: [`
    .library-page { max-width: 1200px; }
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }
    .filters {
      display: flex;
      gap: 12px;
      margin-bottom: 28px;
      flex-wrap: wrap;
    }
    .filter-select {
      padding: 10px 16px;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: 13px;
      font-weight: 500;
      color: var(--text-primary);
      background: var(--card);
      cursor: pointer;
      outline: none;
      transition: all 0.2s;
    }
    .filter-select:focus { border-color: var(--primary); }
    .songs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px;
      color: var(--text-secondary);
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LibraryComponent implements OnInit {
  songs: Song[] = [];
  filteredSongs: Song[] = [];
  paginatedSongs: Song[] = [];
  genres: Genre[] = [];
  selectedGenre = '';
  sortOrder = 'newest';
  loading = true;
  currentPage = 1;
  pageSize = 12;
  totalPages = 1;

  constructor(private songService: SongService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.loadSearchResults(params['search']);
      } else {
        this.loadSongs();
      }
    });
    this.loadGenres();
  }

  loadSongs(): void {
    this.loading = true;
    this.songService.getAllPublicSongs().subscribe({
      next: songs => {
        this.songs = songs;
        this.applyFilters();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadSearchResults(query: string): void {
    this.loading = true;
    this.songService.searchSongs(query).subscribe({
      next: songs => {
        this.songs = songs;
        this.applyFilters();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadGenres(): void {
    this.songService.getAllGenres().subscribe({
      next: genres => this.genres = genres,
      error: () => {}
    });
  }

  applyFilters(): void {
    let result = [...this.songs];
    if (this.selectedGenre) {
      result = result.filter(s => s.genre?.toLowerCase() === this.selectedGenre.toLowerCase());
    }
    if (this.sortOrder === 'plays') {
      result.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
    } else if (this.sortOrder === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime());
    } else {
      result.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
    }
    this.filteredSongs = result;
    this.currentPage = 1;
    this.totalPages = Math.ceil(result.length / this.pageSize);
    this.updatePagination();
  }

  clearFilters(): void {
    this.selectedGenre = '';
    this.sortOrder = 'newest';
    this.applyFilters();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedSongs = this.filteredSongs.slice(start, start + this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.updatePagination(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.updatePagination(); }
  }
}
