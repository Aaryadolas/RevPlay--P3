import { Component, OnInit } from '@angular/core';
import { SongService } from '../../../services/song.service';
import { AuthService } from '../../../services/auth.service';
import { Song } from '../../../models/models';

@Component({
  selector: 'app-my-songs',
  template: `
    <div class="my-songs-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">My Songs 🎵</h1>
          <p class="page-subtitle">Manage your uploaded songs</p>
        </div>
        <button class="btn-primary" routerLink="/artist/upload">+ Upload Song</button>
      </div>

      <div *ngIf="loading" class="loading"><div class="spinner"></div></div>

      <div class="empty-state" *ngIf="!loading && songs.length === 0">
        <div class="empty-icon">🎵</div>
        <h3>No songs uploaded yet</h3>
        <p>Upload your first song to get started</p>
        <button class="btn-primary" routerLink="/artist/upload">Upload Song</button>
      </div>

      <div class="card" *ngIf="!loading && songs.length > 0">
        <table class="songs-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Genre</th>
              <th>Duration</th>
              <th>Plays</th>
              <th>Visibility</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let song of songs; let i = index">
              <td>
                <div class="song-num-cell">
                  <div class="song-mini-cover">
                    <img *ngIf="song.coverImage" [src]="song.coverImage" />
                    <span *ngIf="!song.coverImage">🎵</span>
                  </div>
                  {{ i + 1 }}
                </div>
              </td>
              <td><span class="song-title-cell">{{ song.title }}</span></td>
              <td><span class="badge">{{ song.genre }}</span></td>
              <td>{{ formatDuration(song.duration) }}</td>
              <td>{{ song.playCount || 0 }}</td>
              <td>
                <span class="visibility-badge" [class.public]="song.visibility === 'PUBLIC'">
                  {{ song.visibility }}
                </span>
              </td>
              <td>
                <div class="action-btns">
                  <button class="edit-btn" (click)="editSong(song)">✏️ Edit</button>
                  <button class="del-btn" (click)="deleteSong(song.id!)">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Edit Modal -->
      <div class="modal-overlay" *ngIf="editingSong" (click)="editingSong = null">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <h2 style="margin-bottom: 20px;">Edit Song</h2>
          <div class="form-group">
            <label>Title</label>
            <input class="input-field" [(ngModel)]="editTitle" />
          </div>
          <div class="form-group">
            <label>Genre</label>
            <input class="input-field" [(ngModel)]="editGenre" />
          </div>
          <div class="form-group">
            <label>Visibility</label>
            <select class="input-field" [(ngModel)]="editVisibility">
              <option value="PUBLIC">Public</option>
              <option value="UNLISTED">Unlisted</option>
            </select>
          </div>
          <div class="modal-actions">
            <button class="btn-primary" (click)="saveEdit()">Save</button>
            <button class="btn-secondary" (click)="editingSong = null">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .my-songs-page { max-width: 1100px; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
    .song-num-cell { display: flex; align-items: center; gap: 10px; }
    .song-mini-cover { width: 36px; height: 36px; border-radius: 6px; background: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 14px; overflow: hidden; flex-shrink: 0; }
    .song-mini-cover img { width: 100%; height: 100%; object-fit: cover; }
    .song-title-cell { font-weight: 600; font-size: 14px; }
    .visibility-badge { padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; background: #FEF3C7; color: #D97706; }
    .visibility-badge.public { background: #D1FAE5; color: #059669; }
    .action-btns { display: flex; gap: 8px; }
    .edit-btn { background: var(--accent); color: var(--primary-dark); border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .edit-btn:hover { background: var(--primary); color: white; }
    .del-btn { background: #FEE2E2; color: #EF4444; border: none; padding: 6px 10px; border-radius: 6px; font-size: 12px; cursor: pointer; transition: all 0.2s; }
    .del-btn:hover { background: #EF4444; color: white; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-card { background: white; border-radius: var(--radius-lg); padding: 32px; width: 440px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
    .modal-actions { display: flex; gap: 10px; margin-top: 8px; }
    .loading { display: flex; justify-content: center; padding: 60px; }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class MySongsComponent implements OnInit {
  songs: Song[] = [];
  loading = true;
  editingSong: Song | null = null;
  editTitle = '';
  editGenre = '';
  editVisibility = 'PUBLIC';

  constructor(private songService: SongService, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.songService.getSongsByArtist(user.userId).subscribe({
        next: s => { this.songs = s; this.loading = false; },
        error: () => this.loading = false
      });
    }
  }

  formatDuration(seconds?: number): string {
    if (!seconds) return '-';
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  }

  editSong(song: Song): void {
    this.editingSong = song;
    this.editTitle = song.title;
    this.editGenre = song.genre;
    this.editVisibility = song.visibility || 'PUBLIC';
  }

  saveEdit(): void {
    if (!this.editingSong?.id) return;
    this.songService.updateSong(this.editingSong.id, {
      title: this.editTitle,
      genre: this.editGenre,
      visibility: this.editVisibility
    }).subscribe({
      next: updated => {
        const idx = this.songs.findIndex(s => s.id === updated.id);
        if (idx >= 0) this.songs[idx] = updated;
        this.editingSong = null;
      },
      error: () => {}
    });
  }

  deleteSong(id: number): void {
    if (confirm('Delete this song?')) {
      this.songService.deleteSong(id).subscribe(() => {
        this.songs = this.songs.filter(s => s.id !== id);
      });
    }
  }
}
