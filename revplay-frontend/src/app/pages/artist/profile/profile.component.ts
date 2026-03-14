import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ArtistService } from '../../../services/artist.service';
import { AuthService } from '../../../services/auth.service';
import { Artist } from '../../../models/models';

@Component({
  selector: 'app-artist-profile',
  template: `
    <div class="profile-page">
      <h1 class="page-title">Artist Profile 👤</h1>
      <p class="page-subtitle">Update your artist information</p>

      <div *ngIf="loading" class="loading"><div class="spinner"></div></div>

      <div *ngIf="!loading">
        <div class="profile-banner" *ngIf="artist?.bannerImage">
          <img [src]="artist?.bannerImage" class="banner-img" />
        </div>

        <div class="profile-header card">
          <div class="profile-avatar">
            <img *ngIf="artist?.profilePicture" [src]="artist?.profilePicture" class="avatar-img" />
            <div *ngIf="!artist?.profilePicture" class="avatar-placeholder">🎤</div>
          </div>
          <div class="profile-info">
            <h2>{{ artist?.artistName }}</h2>
            <p class="artist-genre" *ngIf="artist?.genre">{{ artist?.genre }}</p>
            <p class="artist-bio" *ngIf="artist?.bio">{{ artist?.bio }}</p>
          </div>
        </div>

        <div class="edit-section">
          <div class="card">
            <h2 style="margin-bottom: 20px;">Edit Profile</h2>
            <div class="success-msg" *ngIf="successMsg">{{ successMsg }}</div>
            <div class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</div>

            <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
              <div class="form-grid">
                <div class="form-group">
                  <label>Artist Name *</label>
                  <input class="input-field" placeholder="Your artist name" formControlName="artistName" />
                </div>
                <div class="form-group">
                  <label>Genre</label>
                  <input class="input-field" placeholder="e.g. Pop, Rock, Jazz" formControlName="genre" />
                </div>
                <div class="form-group full-width">
                  <label>Bio</label>
                  <textarea class="input-field" rows="3" placeholder="Tell your fans about yourself..." formControlName="bio"></textarea>
                </div>
                <div class="form-group full-width">
                  <label>Profile Picture URL</label>
                  <input class="input-field" placeholder="https://example.com/photo.jpg" formControlName="profilePicture" />
                </div>
                <div class="form-group full-width">
                  <label>Banner Image URL</label>
                  <input class="input-field" placeholder="https://example.com/banner.jpg" formControlName="bannerImage" />
                </div>
              </div>
              <button type="submit" class="btn-primary" [disabled]="saving">
                {{ saving ? 'Saving...' : 'Save Profile' }}
              </button>
            </form>
          </div>

          <div class="card">
            <h2 style="margin-bottom: 20px;">Social Links</h2>
            <div class="form-grid">
              <div class="form-group">
                <label>🎵 Instagram</label>
                <input class="input-field" placeholder="https://instagram.com/..." [(ngModel)]="socialLinks.instagram" />
              </div>
              <div class="form-group">
                <label>🐦 Twitter</label>
                <input class="input-field" placeholder="https://twitter.com/..." [(ngModel)]="socialLinks.twitter" />
              </div>
              <div class="form-group">
                <label>▶️ YouTube</label>
                <input class="input-field" placeholder="https://youtube.com/..." [(ngModel)]="socialLinks.youtube" />
              </div>
              <div class="form-group">
                <label>🎧 Spotify</label>
                <input class="input-field" placeholder="https://spotify.com/..." [(ngModel)]="socialLinks.spotify" />
              </div>
              <div class="form-group full-width">
                <label>🌐 Website</label>
                <input class="input-field" placeholder="https://yourwebsite.com" [(ngModel)]="socialLinks.website" />
              </div>
            </div>
            <button class="btn-primary" (click)="saveSocialLinks()" [disabled]="savingSocial">
              {{ savingSocial ? 'Saving...' : 'Save Social Links' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page { max-width: 900px; }
    .profile-banner { margin-bottom: 20px; border-radius: var(--radius); overflow: hidden; height: 200px; }
    .banner-img { width: 100%; height: 100%; object-fit: cover; }
    .profile-header { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; }
    .profile-avatar { width: 80px; height: 80px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
    .avatar-img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-placeholder { width: 80px; height: 80px; background: linear-gradient(135deg, var(--accent), var(--primary-light)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; }
    .profile-info h2 { font-size: 20px; margin-bottom: 4px; }
    .artist-genre { font-size: 13px; color: var(--primary); font-weight: 600; margin-bottom: 4px; }
    .artist-bio { font-size: 13px; color: var(--text-secondary); }
    .edit-section { display: flex; flex-direction: column; gap: 24px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 13px; font-weight: 600; }
    .form-group.full-width { grid-column: span 2; }
    textarea.input-field { resize: vertical; }
    .success-msg { background: #F0FDF4; color: #22C55E; padding: 12px 16px; border-radius: var(--radius-sm); margin-bottom: 16px; font-size: 14px; }
    .error-msg { background: #FEF2F2; color: #EF4444; padding: 12px 16px; border-radius: var(--radius-sm); margin-bottom: 16px; font-size: 14px; }
    .loading { display: flex; justify-content: center; padding: 60px; }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ArtistProfileComponent implements OnInit {
  artist: Artist | null = null;
  profileForm: FormGroup;
  socialLinks: any = {};
  loading = true;
  saving = false;
  savingSocial = false;
  successMsg = '';
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private artistService: ArtistService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      artistName: [''],
      bio: [''],
      genre: [''],
      profilePicture: [''],
      bannerImage: ['']
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.artistService.getArtistByUserId(user.userId).subscribe({
        next: artist => {
          this.artist = artist;
          this.profileForm.patchValue({
            artistName: artist.artistName,
            bio: artist.bio,
            genre: artist.genre,
            profilePicture: artist.profilePicture,
            bannerImage: artist.bannerImage
          });
          this.socialLinks = artist.socialLinks || {};
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }

  saveProfile(): void {
    if (!this.artist?.id) return;
    this.saving = true;
    this.artistService.updateArtist(this.artist.id, this.profileForm.value).subscribe({
      next: updated => {
        this.artist = updated;
        this.saving = false;
        this.successMsg = 'Profile updated successfully!';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: err => {
        this.saving = false;
        this.errorMsg = err.error?.message || 'Update failed.';
      }
    });
  }

  saveSocialLinks(): void {
    if (!this.artist?.id) return;
    this.savingSocial = true;
    this.artistService.updateSocialLinks(this.artist.id, this.socialLinks).subscribe({
      next: () => {
        this.savingSocial = false;
        this.successMsg = 'Social links updated!';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => this.savingSocial = false
    });
  }
}
