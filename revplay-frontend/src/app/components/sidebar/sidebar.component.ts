import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  template: `
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-section-title" *ngIf="isArtist">Artist</div>
          <ng-container *ngIf="isArtist">
            <a class="nav-item" routerLink="/artist/dashboard" routerLinkActive="active">
              <span class="nav-icon">📊</span>
              <span>Dashboard</span>
            </a>
            <a class="nav-item" routerLink="/artist/my-songs" routerLinkActive="active">
              <span class="nav-icon">🎵</span>
              <span>My Songs</span>
            </a>
            <a class="nav-item" routerLink="/artist/albums" routerLinkActive="active">
              <span class="nav-icon">💿</span>
              <span>Albums</span>
            </a>
            <a class="nav-item" routerLink="/artist/upload" routerLinkActive="active">
              <span class="nav-icon">⬆️</span>
              <span>Upload Music</span>
            </a>
            <a class="nav-item" routerLink="/artist/analytics" routerLinkActive="active">
              <span class="nav-icon">📈</span>
              <span>Analytics</span>
            </a>
            <a class="nav-item" routerLink="/artist/profile" routerLinkActive="active">
              <span class="nav-icon">👤</span>
              <span>Profile</span>
            </a>
          </ng-container>

          <div class="nav-section-title">Music</div>
          <a class="nav-item" routerLink="/library" routerLinkActive="active">
            <span class="nav-icon">📚</span>
            <span>Library</span>
          </a>
          <a class="nav-item" routerLink="/favorites" routerLinkActive="active" *ngIf="isLoggedIn">
            <span class="nav-icon">❤️</span>
            <span>Favorites</span>
          </a>
          <a class="nav-item" routerLink="/playlists" routerLinkActive="active" *ngIf="isLoggedIn">
            <span class="nav-icon">🎶</span>
            <span>Playlists</span>
          </a>
          <a class="nav-item" routerLink="/history" routerLinkActive="active" *ngIf="isLoggedIn">
            <span class="nav-icon">🕐</span>
            <span>History</span>
          </a>
          <a class="nav-item" routerLink="/explore" routerLinkActive="active">
            <span class="nav-icon">🌍</span>
            <span>Explore</span>
          </a>

          <div class="nav-section-title" *ngIf="isLoggedIn">Account</div>
          <a class="nav-item" routerLink="/my-stats" routerLinkActive="active" *ngIf="isLoggedIn">
            <span class="nav-icon">📊</span>
            <span>My Statistics</span>
          </a>
          <a class="nav-item logout" (click)="logout()" *ngIf="isLoggedIn">
            <span class="nav-icon">🚪</span>
            <span>Logout</span>
          </a>

          <a class="nav-item" routerLink="/login" *ngIf="!isLoggedIn">
            <span class="nav-icon">🔐</span>
            <span>Login</span>
          </a>
        </div>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      min-height: calc(100vh - 64px - 90px);
      background: var(--card);
      border-right: 1px solid var(--border);
      padding: 16px 0;
      position: sticky;
      top: 64px;
      height: calc(100vh - 64px - 90px);
      overflow-y: auto;
    }
    .sidebar-nav { padding: 8px; }
    .nav-section-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      padding: 12px 12px 6px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: var(--radius-sm);
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s;
      margin-bottom: 2px;
    }
    .nav-item:hover {
      background: var(--accent);
      color: var(--primary-dark);
    }
    .nav-item.active {
      background: var(--accent);
      color: var(--primary-dark);
      font-weight: 600;
    }
    .nav-icon { font-size: 16px; width: 20px; text-align: center; }
    .nav-item.logout {
      color: #EF4444;
      margin-top: 8px;
    }
    .nav-item.logout:hover { background: #FEF2F2; }
  `]
})
export class SidebarComponent implements OnInit {
  isLoggedIn = false;
  isArtist = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isArtist = user?.role === 'ARTIST';
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
