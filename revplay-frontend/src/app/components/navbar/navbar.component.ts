import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SongService } from '../../services/song.service';
import { ArtistService } from '../../services/artist.service';
import { Genre, Artist } from '../../models/models';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar">
      <div class="nav-brand" routerLink="/library">
        <span class="brand-icon">🎵</span>
        <span class="brand-name">RevPlay</span>
      </div>

      <div class="nav-search">
        <div class="search-wrapper">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            class="search-input"
            placeholder="Search songs, artists..."
            [(ngModel)]="searchQuery"
            (keyup.enter)="onSearch()"
          />
        </div>
      </div>

      <div class="nav-actions">
        <div class="dropdown">
          <button class="nav-btn" (click)="toggleGenreDropdown()">
            Browse by Genre <span>▾</span>
          </button>
          <div class="dropdown-menu genre-menu" *ngIf="showGenreDropdown">
            <div class="dropdown-item" (click)="browseByGenre('')">All Genres</div>
            <div class="dropdown-item" *ngFor="let genre of genres" (click)="browseByGenre(genre.name)">
              {{ genre.name }}
            </div>
          </div>
        </div>

        <div class="dropdown">
          <button class="nav-btn" (click)="toggleMoreDropdown()">
            Browse More <span>▾</span>
          </button>
          <div class="dropdown-menu" *ngIf="showMoreDropdown">
            <div class="dropdown-item" routerLink="/browse-artist" (click)="showMoreDropdown=false">
              🎤 By Artist
            </div>
            <div class="dropdown-item" routerLink="/browse-album" (click)="showMoreDropdown=false">
              💿 By Album
            </div>
          </div>
        </div>

        <div *ngIf="!isLoggedIn">
          <button class="btn-login" routerLink="/login">Login</button>
        </div>

        <div *ngIf="isLoggedIn" class="user-menu">
          <div class="user-avatar" (click)="toggleUserDropdown()">
            {{ userInitial }}
          </div>
          <div class="dropdown-menu user-dropdown" *ngIf="showUserDropdown">
            <div class="user-info">
              <div class="user-name">{{ userName }}</div>
              <div class="user-role badge">{{ userRole }}</div>
            </div>
            <hr style="border-color: var(--border); margin: 8px 0;">
            <div class="dropdown-item" routerLink="/library" (click)="showUserDropdown=false">📚 Library</div>
            <div class="dropdown-item" *ngIf="isArtist" routerLink="/artist/dashboard" (click)="showUserDropdown=false">🎹 Dashboard</div>
            <div class="dropdown-item danger" (click)="logout()">🚪 Logout</div>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 0 24px;
      height: 64px;
      background: var(--card);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 12px rgba(139,92,246,0.06);
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      min-width: 160px;
    }
    .brand-icon { font-size: 24px; }
    .brand-name {
      font-family: 'Syne', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: var(--primary);
    }
    .nav-search { flex: 1; max-width: 400px; }
    .search-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--background);
      border: 1.5px solid var(--border);
      border-radius: 24px;
      padding: 8px 16px;
      transition: all 0.2s;
    }
    .search-wrapper:focus-within {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
    }
    .search-icon { font-size: 14px; }
    .search-input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 14px;
      width: 100%;
      color: var(--text-primary);
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-left: auto;
    }
    .nav-btn {
      background: transparent;
      border: 1.5px solid var(--border);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.2s;
    }
    .nav-btn:hover {
      border-color: var(--primary);
      color: var(--primary);
    }
    .dropdown { position: relative; }
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-hover);
      min-width: 180px;
      z-index: 1000;
      overflow: hidden;
    }
    .genre-menu {
      max-height: 320px;
      overflow-y: auto;
      min-width: 200px;
    }
    .dropdown-item {
      padding: 10px 16px;
      font-size: 13px;
      cursor: pointer;
      transition: background 0.15s;
      color: var(--text-primary);
    }
    .dropdown-item:hover { background: var(--background); color: var(--primary); }
    .dropdown-item.danger { color: #EF4444; }
    .dropdown-item.danger:hover { background: #FEF2F2; }
    .btn-login {
      background: var(--primary);
      color: white;
      border: none;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-login:hover { background: var(--primary-dark); }
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
    }
    .user-menu { position: relative; }
    .user-dropdown { right: 0; min-width: 200px; }
    .user-info { padding: 12px 16px; }
    .user-name { font-weight: 700; font-size: 14px; }
    .user-role { font-size: 11px; margin-top: 4px; display: inline-block; }
  `]
})
export class NavbarComponent implements OnInit {
  genres: Genre[] = [];
  artists: Artist[] = [];
  searchQuery = '';
  showGenreDropdown = false;
  showMoreDropdown = false;
  showUserDropdown = false;
  isLoggedIn = false;
  isArtist = false;
  userName = '';
  userInitial = '';
  userRole = '';

  constructor(
    private authService: AuthService,
    private songService: SongService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isArtist = user?.role === 'ARTIST';
      this.userName = user?.username || '';
      this.userInitial = this.userName.charAt(0).toUpperCase();
      this.userRole = user?.role || '';
    });
    this.loadGenres();
  }

  loadGenres(): void {
    this.songService.getAllGenres().subscribe({
      next: genres => this.genres = genres,
      error: () => {}
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/library'], { queryParams: { search: this.searchQuery } });
    }
  }

  browseByGenre(genre: string): void {
    this.showGenreDropdown = false;
    this.router.navigate(['/browse-genre'], { queryParams: { genre } });
  }

  toggleGenreDropdown(): void {
    this.showGenreDropdown = !this.showGenreDropdown;
    this.showMoreDropdown = false;
    this.showUserDropdown = false;
  }

  toggleMoreDropdown(): void {
    this.showMoreDropdown = !this.showMoreDropdown;
    this.showGenreDropdown = false;
    this.showUserDropdown = false;
  }

  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
    this.showGenreDropdown = false;
    this.showMoreDropdown = false;
  }

  logout(): void {
    this.authService.logout();
    this.showUserDropdown = false;
    this.router.navigate(['/']);
  }
}
