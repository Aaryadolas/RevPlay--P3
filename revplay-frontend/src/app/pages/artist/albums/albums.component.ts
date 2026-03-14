import { Component, OnInit } from '@angular/core';
import { SongService } from '../../../services/song.service';
import { AuthService } from '../../../services/auth.service';
import { Album, Song } from '../../../models/models';

@Component({
  selector: 'app-albums',
  template: `
    <div class="albums-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">My Albums 💿</h1>
          <p class="page-subtitle">Manage your music albums</p>
        </div>
        <button class="btn-primary" (click)="showCreate = true">+ Create Album</button>
      </div>

      <div class="create-form card" *ngIf="showCreate">
        <h3 style="margin-bottom: 16px;">Create New Album</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Album Name *</label>
            <input class="input-field" placeholder="Album name" [(ngModel)]="newAlbum.albumName" />
          </div>
          <div class="form-group">
            <label>Release Date</label>
            <input class="input-field" type="date" [(ngModel)]="newAlbum.releaseDate" />
          </div>
          <div class="form-group full-width">
            <label>Description</label>
            <input class="input-field" placeholder="Album description" [(ngModel)]="newAlbum.description" />
          </div>
          <div class="form-group full-width">
            <label>Cover Image URL</label>
            <input class="input-field" placeholder="https://example.com/cover.jpg" [(ngModel)]="newAlbum.coverImage" />
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="btn-primary" (click)="createAlbum()">Create Album</button>
          <button class="btn-secondary" (click)="showCreate = false; resetForm()">Cancel</button>
        </div>
      </div>

      <div *ngIf="loading" class="loading"><div class="spinner"></div></div>

      <div class="empty-state" *ngIf="!loading && albums.length === 0 && !showCreate">
        <div class="empty-icon">💿</div>
        <h3>No albums yet</h3>
        <p>Create your first album to organize your music</p>
        <button class="btn-primary" (click)="showCreate = true">+ Create Album</button>
      </div>

      <div class="albums-grid" *ngIf="!loading && albums.length > 0">
        <div class="album-card card" *ngFor="let album of albums">
          <div class="album-cover">
            <img *ngIf="album.coverImage" [src]="album.coverImage" [alt]="album.albumName" />
            <span *ngIf="!album.coverImage">💿</span>
          </div>
          <div class="album-details">
            <div class="album-name">{{ album.albumName }}</div>
            <div class="album-meta">
              {{ album.songs?.length || 0 }} songs
              <span *ngIf="album.releaseDate"> • {{ album.releaseDate }}</span>
            </div>
            <p class="album-desc" *ngIf="album.description">{{ album.description }}</p>
          </div>
          <div class="album-actions">
            <button class="del-btn" (click)="deleteAlbum(album.id!)">🗑️ Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .albums-page { max-width: 1100px; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
    .create-form { margin-bottom: 24px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 13px; font-weight: 600; }
    .form-group.full-width { grid-column: span 2; }
    .albums-grid { display: flex; flex-direction: column; gap: 16px; }
    .album-card { display: flex; align-items: center; gap: 20px; }
    .album-cover { width: 72px; height: 72px; border-radius: 12px; background: linear-gradient(135deg, var(--accent), var(--primary-light)); display: flex; align-items: center; justify-content: center; font-size: 32px; overflow: hidden; flex-shrink: 0; }
    .album-cover img { width: 100%; height: 100%; object-fit: cover; }
    .album-details { flex: 1; }
    .album-name { font-weight: 700; font-size: 16px; margin-bottom: 4px; }
    .album-meta { font-size: 12px; color: var(--text-secondary); }
    .album-desc { font-size: 13px; color: var(--text-secondary); margin-top: 6px; }
    .del-btn { background: #FEE2E2; color: #EF4444; border: none; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .del-btn:hover { background: #EF4444; color: white; }
    .loading { display: flex; justify-content: center; padding: 60px; }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class AlbumsComponent implements OnInit {
  albums: Album[] = [];
  loading = true;
  showCreate = false;
  newAlbum: any = { albumName: '', description: '', coverImage: '', releaseDate: '' };

  constructor(private songService: SongService, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.songService.getAlbumsByArtist(user.userId).subscribe({
        next: a => { this.albums = a; this.loading = false; },
        error: () => this.loading = false
      });
    }
  }

  createAlbum(): void {
    if (!this.newAlbum.albumName.trim()) return;
    this.songService.createAlbum(this.newAlbum).subscribe({
      next: album => {
        this.albums.unshift(album);
        this.showCreate = false;
        this.resetForm();
      },
      error: () => {}
    });
  }

  deleteAlbum(id: number): void {
    if (confirm('Delete this album?')) {
      this.songService.deleteAlbum(id).subscribe(() => {
        this.albums = this.albums.filter(a => a.id !== id);
      });
    }
  }

  resetForm(): void {
    this.newAlbum = { albumName: '', description: '', coverImage: '', releaseDate: '' };
  }
}
