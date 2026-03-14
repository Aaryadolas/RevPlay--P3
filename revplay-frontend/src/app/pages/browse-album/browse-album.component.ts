import { Component, OnInit } from '@angular/core';
import { SongService } from '../../services/song.service';
import { Album } from '../../models/models';

@Component({
  selector: 'app-browse-album',
  template: `
    <div class="browse-page">
      <h1 class="page-title">Browse by Album 💿</h1>
      <p class="page-subtitle">Explore music by albums</p>

      <div *ngIf="loading" class="loading"><div class="spinner"></div></div>

      <div class="albums-grid" *ngIf="!loading && albums.length > 0">
        <div class="album-card card" *ngFor="let album of albums" (click)="selectAlbum(album)">
          <div class="album-cover">
            <img *ngIf="album.coverImage" [src]="album.coverImage" [alt]="album.albumName" />
            <span *ngIf="!album.coverImage">💿</span>
          </div>
          <div class="album-name">{{ album.albumName }}</div>
          <div class="album-meta">{{ album.songs?.length || 0 }} songs</div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && albums.length === 0">
        <div class="empty-icon">💿</div>
        <h3>No albums yet</h3>
      </div>

      <div class="album-detail" *ngIf="selectedAlbum">
        <h2 class="section-header">{{ selectedAlbum.albumName }}</h2>
        <p *ngIf="selectedAlbum.description" class="album-desc">{{ selectedAlbum.description }}</p>
        <div class="songs-grid" *ngIf="selectedAlbum.songs && selectedAlbum.songs.length > 0">
          <app-song-card *ngFor="let song of selectedAlbum.songs" [song]="song" [queue]="selectedAlbum.songs || []"></app-song-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .browse-page { max-width: 1200px; }
    .albums-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; margin-bottom: 32px; }
    .album-card { cursor: pointer; transition: all 0.2s; text-align: center; padding: 16px; }
    .album-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
    .album-cover { width: 100%; aspect-ratio: 1; border-radius: 12px; background: linear-gradient(135deg, var(--accent), var(--primary-light)); display: flex; align-items: center; justify-content: center; font-size: 40px; margin-bottom: 12px; overflow: hidden; }
    .album-cover img { width: 100%; height: 100%; object-fit: cover; }
    .album-name { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
    .album-meta { font-size: 12px; color: var(--text-secondary); }
    .section-header { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
    .album-desc { color: var(--text-secondary); margin-bottom: 20px; font-size: 14px; }
    .songs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
    .loading { display: flex; justify-content: center; padding: 60px; }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class BrowseAlbumComponent implements OnInit {
  albums: Album[] = [];
  selectedAlbum: Album | null = null;
  loading = true;

  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.songService.getAllPublicAlbums().subscribe({
      next: a => { this.albums = a; this.loading = false; },
      error: () => this.loading = false
    });
  }

  selectAlbum(album: Album): void {
    this.selectedAlbum = album;
    this.songService.getAlbumById(album.id!).subscribe({
      next: a => this.selectedAlbum = a,
      error: () => {}
    });
  }
}
