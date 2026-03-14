import { Component, OnInit } from '@angular/core';
import { PlaylistService } from '../../services/other.services';
import { Playlist } from '../../models/models';

@Component({
  selector: 'app-playlists',
  template: `
    <div class="playlists-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Your Playlists 🎶</h1>
          <p class="page-subtitle">Manage and organize your music</p>
        </div>
        <button class="btn-primary" (click)="showCreate = true">+ Create Playlist</button>
      </div>

      <div class="create-form card" *ngIf="showCreate">
        <h3 style="margin-bottom:16px">Create New Playlist</h3>
        <input class="input-field" placeholder="Playlist name *" [(ngModel)]="newName" style="margin-bottom:12px" />
        <input class="input-field" placeholder="Description (optional)" [(ngModel)]="newDesc" style="margin-bottom:12px" />
        <select class="input-field" [(ngModel)]="newPrivacy" style="margin-bottom:16px">
          <option value="PUBLIC">Public</option>
          <option value="PRIVATE">Private</option>
        </select>
        <div style="display:flex;gap:8px">
          <button class="btn-primary" (click)="createPlaylist()">Create</button>
          <button class="btn-secondary" (click)="showCreate = false">Cancel</button>
        </div>
      </div>

      <div *ngIf="loading" class="loading"><div class="spinner"></div></div>

      <div class="empty-state" *ngIf="!loading && playlists.length === 0 && !showCreate">
        <div class="empty-icon">🎶</div>
        <h3>No playlists yet</h3>
        <p>Create your first playlist to start organizing your music</p>
        <button class="btn-primary" (click)="showCreate = true">+ Create Playlist</button>
      </div>

      <div class="playlists-grid" *ngIf="!loading && playlists.length > 0">
        <div class="playlist-card card" *ngFor="let playlist of playlists">
          <div class="playlist-cover">🎶</div>
          <div class="playlist-info">
            <div class="playlist-name">{{ playlist.name }}</div>
            <div class="playlist-meta">
              {{ playlist.totalSongs || 0 }} songs •
              <span class="badge">{{ playlist.privacy }}</span>
            </div>
            <p class="playlist-desc" *ngIf="playlist.description">{{ playlist.description }}</p>
          </div>
          <button class="delete-btn" (click)="deletePlaylist(playlist.id!)">🗑️</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .playlists-page { max-width: 900px; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
    .create-form { margin-bottom: 24px; }
    .playlists-grid { display: flex; flex-direction: column; gap: 12px; }
    .playlist-card { display: flex; align-items: center; gap: 16px; }
    .playlist-cover {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--accent), var(--primary-light));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }
    .playlist-info { flex: 1; }
    .playlist-name { font-weight: 700; font-size: 15px; margin-bottom: 4px; }
    .playlist-meta { font-size: 12px; color: var(--text-secondary); display: flex; align-items: center; gap: 8px; }
    .playlist-desc { font-size: 12px; color: var(--text-secondary); margin-top: 4px; }
    .delete-btn { background: transparent; border: none; font-size: 18px; cursor: pointer; opacity: 0.5; transition: opacity 0.2s; }
    .delete-btn:hover { opacity: 1; }
    .loading { display: flex; justify-content: center; padding: 60px; }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class PlaylistsComponent implements OnInit {
  playlists: Playlist[] = [];
  loading = true;
  showCreate = false;
  newName = '';
  newDesc = '';
  newPrivacy = 'PUBLIC';

  constructor(private playlistService: PlaylistService) {}

  ngOnInit(): void {
    this.loadPlaylists();
  }

  loadPlaylists(): void {
    this.playlistService.getMyPlaylists().subscribe({
      next: p => { this.playlists = p; this.loading = false; },
      error: () => this.loading = false
    });
  }

  createPlaylist(): void {
    if (!this.newName.trim()) return;
    this.playlistService.createPlaylist({ name: this.newName, description: this.newDesc, privacy: this.newPrivacy }).subscribe({
      next: p => {
        this.playlists.unshift(p);
        this.showCreate = false;
        this.newName = '';
        this.newDesc = '';
      },
      error: () => {}
    });
  }

  deletePlaylist(id: number): void {
    if (confirm('Delete this playlist?')) {
      this.playlistService.deletePlaylist(id).subscribe(() => {
        this.playlists = this.playlists.filter(p => p.id !== id);
      });
    }
  }
}
