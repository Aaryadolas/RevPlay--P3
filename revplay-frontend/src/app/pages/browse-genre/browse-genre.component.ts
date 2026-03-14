import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SongService } from '../../services/song.service';
import { Song, Genre } from '../../models/models';

@Component({
  selector: 'app-browse-genre',
  template: `
    <div class="browse-genre-page">
      <h1 class="page-title">Browse by Genre 🎸</h1>

      <div class="genres-list">
        <button
          class="genre-chip"
          [class.active]="selectedGenre === ''"
          (click)="selectGenre('')"
        >All</button>
        <button
          class="genre-chip"
          *ngFor="let genre of genres"
          [class.active]="selectedGenre === genre.name"
          (click)="selectGenre(genre.name)"
        >{{ genre.name }}</button>
      </div>

      <div *ngIf="loading" class="loading"><div class="spinner"></div></div>

      <div *ngIf="selectedGenre && !loading">
        <h2 class="section-header">{{ selectedGenre }} Songs</h2>
        <div class="songs-grid" *ngIf="songs.length > 0">
          <app-song-card *ngFor="let song of songs" [song]="song" [queue]="songs"></app-song-card>
        </div>
        <div class="empty-state" *ngIf="songs.length === 0">
          <div class="empty-icon">🎵</div>
          <h3>No songs in this genre</h3>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .browse-genre-page { max-width: 1200px; }
    .genres-list { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 32px; }
    .genre-chip {
      padding: 8px 20px;
      border-radius: 20px;
      border: 1.5px solid var(--border);
      background: var(--card);
      color: var(--text-primary);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .genre-chip:hover, .genre-chip.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }
    .section-header { font-size: 20px; font-weight: 700; margin-bottom: 20px; }
    .songs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 20px;
    }
    .loading { display: flex; justify-content: center; padding: 60px; }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class BrowseGenreComponent implements OnInit {
  genres: Genre[] = [];
  songs: Song[] = [];
  selectedGenre = '';
  loading = false;

  constructor(private songService: SongService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.songService.getAllGenres().subscribe({ next: g => this.genres = g, error: () => {} });
    this.route.queryParams.subscribe(params => {
      if (params['genre']) this.selectGenre(params['genre']);
    });
  }

  selectGenre(genre: string): void {
    this.selectedGenre = genre;
    if (!genre) { this.songs = []; return; }
    this.loading = true;
    this.songService.getSongsByGenre(genre).subscribe({
      next: s => { this.songs = s; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
