import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SongService } from '../../../services/song.service';
import { Genre, Album } from '../../../models/models';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-upload-song',
  template: `
    <div class="upload-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Upload Song ⬆️</h1>
          <p class="page-subtitle">Share your music with the world</p>
        </div>
        <button class="btn-secondary" routerLink="/artist/my-songs">← Back to Songs</button>
      </div>

      <div class="upload-card card">
        <div class="success-msg" *ngIf="successMsg">{{ successMsg }}</div>
        <div class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</div>

        <form [formGroup]="uploadForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-group">
              <label>Song Title *</label>
              <input class="input-field" placeholder="Enter song title" formControlName="title" />
            </div>

            <div class="form-group">
              <label>Genre *</label>
              <select class="input-field" formControlName="genre">
                <option value="">Select Genre</option>
                <option *ngFor="let genre of genres" [value]="genre.name">{{ genre.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Duration (seconds)</label>
              <input class="input-field" type="number" placeholder="240" formControlName="duration" />
            </div>

            <div class="form-group">
              <label>Album (Optional)</label>
              <select class="input-field" formControlName="albumId">
                <option value="">No Album</option>
                <option *ngFor="let album of albums" [value]="album.id">{{ album.albumName }}</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label>Audio URL *</label>
              <input class="input-field" placeholder="https://example.com/song.mp3" formControlName="audioUrl" />
              <small class="hint">Provide a direct URL to your audio file (MP3, WAV, etc.)</small>
            </div>

            <div class="form-group full-width">
              <label>Cover Image URL</label>
              <input class="input-field" placeholder="https://example.com/cover.jpg" formControlName="coverImage" />
            </div>

            <div class="form-group">
              <label>Release Date</label>
              <input class="input-field" type="date" formControlName="releaseDate" />
            </div>

            <div class="form-group">
              <label>Visibility</label>
              <select class="input-field" formControlName="visibility">
                <option value="PUBLIC">Public</option>
                <option value="UNLISTED">Unlisted</option>
              </select>
            </div>
          </div>

          <div class="preview-section" *ngIf="uploadForm.get('coverImage')?.value">
            <label>Cover Preview</label>
            <img [src]="uploadForm.get('coverImage')?.value" class="cover-preview" />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary btn-large" [disabled]="uploading">
              {{ uploading ? 'Uploading...' : '⬆️ Upload Song' }}
            </button>
            <button type="button" class="btn-secondary" (click)="resetForm()">Reset</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .upload-page { max-width: 900px; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
    .upload-card { padding: 32px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 13px; font-weight: 600; color: var(--text-primary); }
    .form-group.full-width { grid-column: span 2; }
    .hint { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
    .preview-section { margin-bottom: 24px; }
    .preview-section label { font-size: 13px; font-weight: 600; display: block; margin-bottom: 8px; }
    .cover-preview { width: 120px; height: 120px; object-fit: cover; border-radius: 12px; border: 1px solid var(--border); }
    .form-actions { display: flex; gap: 12px; align-items: center; }
    .btn-large { padding: 14px 32px; font-size: 15px; }
    .success-msg { background: #F0FDF4; color: #22C55E; padding: 12px 16px; border-radius: var(--radius-sm); margin-bottom: 20px; font-size: 14px; }
    .error-msg { background: #FEF2F2; color: #EF4444; padding: 12px 16px; border-radius: var(--radius-sm); margin-bottom: 20px; font-size: 14px; }
    @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } .form-group.full-width { grid-column: span 1; } }
  `]
})
export class UploadSongComponent implements OnInit {
  uploadForm: FormGroup;
  genres: Genre[] = [];
  albums: Album[] = [];
  uploading = false;
  successMsg = '';
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private songService: SongService,
    private authService: AuthService,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      genre: ['', Validators.required],
      duration: [''],
      albumId: [''],
      audioUrl: ['', Validators.required],
      coverImage: [''],
      releaseDate: [''],
      visibility: ['PUBLIC']
    });
  }

  ngOnInit(): void {
    this.songService.getAllGenres().subscribe({ next: g => this.genres = g, error: () => {} });
    const user = this.authService.getCurrentUser();
    if (user) {
      this.songService.getAlbumsByArtist(user.userId).subscribe({ next: a => this.albums = a, error: () => {} });
    }
  }

  onSubmit(): void {
    if (this.uploadForm.invalid) return;
    this.uploading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const value = this.uploadForm.value;
    const payload: any = {
      title: value.title,
      genre: value.genre,
      audioUrl: value.audioUrl,
      visibility: value.visibility
    };
    if (value.duration) payload.duration = parseInt(value.duration);
    if (value.albumId) payload.albumId = parseInt(value.albumId);
    if (value.coverImage) payload.coverImage = value.coverImage;
    if (value.releaseDate) payload.releaseDate = value.releaseDate;

    this.songService.createSong(payload).subscribe({
      next: () => {
        this.uploading = false;
        this.successMsg = '🎉 Song uploaded successfully!';
        this.resetForm();
        setTimeout(() => this.router.navigate(['/artist/my-songs']), 2000);
      },
      error: err => {
        this.uploading = false;
        this.errorMsg = err.error?.message || 'Upload failed. Please try again.';
      }
    });
  }

  resetForm(): void {
    this.uploadForm.reset({ visibility: 'PUBLIC' });
  }
}
