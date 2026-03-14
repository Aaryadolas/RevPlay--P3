import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  template: `
    <div class="landing">
      <header class="landing-header">
        <div class="logo">
          <span class="logo-icon">🎵</span>
          <span class="logo-text">RevPlay</span>
        </div>
        <div class="header-actions">
          <button class="btn-outline" routerLink="/login">Login</button>
          <button class="btn-filled" routerLink="/register">Get Started</button>
        </div>
      </header>

      <section class="hero">
        <div class="hero-content">
          <div class="hero-badge">✨ Music Streaming Platform</div>
          <h1 class="hero-title">
            Where Music Meets
            <span class="gradient-text"> Passion</span>
          </h1>
          <p class="hero-desc">
            Discover, stream, and share music from independent artists worldwide.
            Upload your creations or explore millions of tracks.
          </p>
          <div class="hero-actions">
            <button class="btn-hero-primary" routerLink="/register">
              Start Listening Free
            </button>
            <button class="btn-hero-secondary" routerLink="/library">
              Browse Music
            </button>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <div class="stat-num">10K+</div>
              <div class="stat-lbl">Songs</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <div class="stat-num">500+</div>
              <div class="stat-lbl">Artists</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <div class="stat-num">50K+</div>
              <div class="stat-lbl">Listeners</div>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="visual-card main-card">
            <div class="visual-cover">🎵</div>
            <div class="visual-info">
              <div class="v-title">Now Playing</div>
              <div class="v-artist">Featured Artist</div>
              <div class="v-controls">
                <span>⏮</span>
                <span class="v-play">▶</span>
                <span>⏭</span>
              </div>
            </div>
          </div>
          <div class="floating-card card-1">🎸 Rock</div>
          <div class="floating-card card-2">🎹 Pop</div>
          <div class="floating-card card-3">🎷 Jazz</div>
        </div>
      </section>

      <section class="features">
        <h2 class="section-title">Everything you need</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎵</div>
            <h3>Stream Music</h3>
            <p>Listen to millions of songs from independent artists worldwide.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">❤️</div>
            <h3>Save Favorites</h3>
            <p>Save your favorite songs and access them anytime.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎶</div>
            <h3>Create Playlists</h3>
            <p>Organize your music into custom playlists.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📈</div>
            <h3>Artist Analytics</h3>
            <p>Track your music performance with detailed analytics.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⬆️</div>
            <h3>Upload Music</h3>
            <p>Share your music with the world as an artist.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>Discover</h3>
            <p>Find new music by genre, artist, or album.</p>
          </div>
        </div>
      </section>

      <section class="cta">
        <div class="cta-content">
          <h2>Ready to start your music journey?</h2>
          <p>Join thousands of music lovers and artists on RevPlay.</p>
          <div class="cta-actions">
            <button class="btn-cta" routerLink="/register">Join as Listener</button>
            <button class="btn-cta-outline" routerLink="/register">Join as Artist</button>
          </div>
        </div>
      </section>

      <footer class="landing-footer">
        <div class="footer-brand">
          <span>🎵</span>
          <span>RevPlay</span>
        </div>
        <p>© 2026 RevPlay. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .landing {
      min-height: 100vh;
      background: var(--background);
    }
    .landing-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 80px;
      background: var(--card);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Syne', sans-serif;
      font-size: 22px;
      font-weight: 800;
      color: var(--primary);
    }
    .logo-icon { font-size: 24px; }
    .header-actions { display: flex; gap: 12px; }
    .btn-outline {
      background: transparent;
      border: 1.5px solid var(--primary);
      color: var(--primary);
      padding: 10px 24px;
      border-radius: 24px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-outline:hover { background: var(--accent); }
    .btn-filled {
      background: var(--primary);
      color: white;
      border: none;
      padding: 10px 24px;
      border-radius: 24px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-filled:hover { background: var(--primary-dark); }

    .hero {
      display: flex;
      align-items: center;
      gap: 60px;
      padding: 80px 80px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .hero-content { flex: 1; }
    .hero-badge {
      display: inline-block;
      background: var(--accent);
      color: var(--primary-dark);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .hero-title {
      font-size: 52px;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 20px;
      color: var(--text-primary);
    }
    .gradient-text {
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-desc {
      font-size: 16px;
      color: var(--text-secondary);
      margin-bottom: 32px;
      line-height: 1.7;
    }
    .hero-actions { display: flex; gap: 16px; margin-bottom: 40px; }
    .btn-hero-primary {
      background: var(--primary);
      color: white;
      border: none;
      padding: 14px 32px;
      border-radius: 28px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 8px 24px rgba(139,92,246,0.3);
    }
    .btn-hero-primary:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
    }
    .btn-hero-secondary {
      background: transparent;
      color: var(--primary);
      border: 2px solid var(--primary);
      padding: 14px 32px;
      border-radius: 28px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-hero-secondary:hover { background: var(--accent); }
    .hero-stats { display: flex; align-items: center; gap: 24px; }
    .stat-num {
      font-family: 'Syne', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: var(--primary);
    }
    .stat-lbl { font-size: 12px; color: var(--text-secondary); }
    .stat-divider { width: 1px; height: 40px; background: var(--border); }

    .hero-visual {
      flex: 1;
      position: relative;
      height: 400px;
    }
    .visual-card {
      position: absolute;
      background: var(--card);
      border-radius: var(--radius-lg);
      padding: 20px;
      box-shadow: var(--shadow-hover);
      border: 1px solid var(--border);
    }
    .main-card {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 220px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 12px;
    }
    .visual-cover {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, var(--accent), var(--primary-light));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
    }
    .v-title { font-weight: 700; font-size: 15px; }
    .v-artist { font-size: 12px; color: var(--text-secondary); }
    .v-controls { display: flex; gap: 16px; font-size: 18px; margin-top: 4px; }
    .v-play {
      width: 32px;
      height: 32px;
      background: var(--primary);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
    .floating-card {
      position: absolute;
      background: var(--card);
      border-radius: 12px;
      padding: 10px 16px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
      color: var(--primary-dark);
    }
    .card-1 { top: 10%; left: 5%; animation: float1 3s ease-in-out infinite; }
    .card-2 { top: 15%; right: 5%; animation: float2 3s ease-in-out infinite 1s; }
    .card-3 { bottom: 15%; left: 10%; animation: float1 3s ease-in-out infinite 0.5s; }
    @keyframes float1 {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    @keyframes float2 {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(8px); }
    }

    .features {
      padding: 80px;
      background: var(--card);
      border-top: 1px solid var(--border);
    }
    .section-title {
      text-align: center;
      font-size: 36px;
      font-weight: 800;
      margin-bottom: 48px;
      color: var(--text-primary);
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      max-width: 1000px;
      margin: 0 auto;
    }
    .feature-card {
      padding: 28px;
      border-radius: var(--radius);
      border: 1.5px solid var(--border);
      background: var(--background);
      transition: all 0.2s;
    }
    .feature-card:hover {
      border-color: var(--primary);
      box-shadow: var(--shadow);
      transform: translateY(-4px);
    }
    .feature-icon { font-size: 32px; margin-bottom: 16px; }
    .feature-card h3 { font-size: 16px; margin-bottom: 8px; }
    .feature-card p { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }

    .cta {
      padding: 80px;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      text-align: center;
    }
    .cta-content { max-width: 600px; margin: 0 auto; }
    .cta h2 { font-size: 36px; color: white; margin-bottom: 16px; }
    .cta p { color: rgba(255,255,255,0.8); font-size: 16px; margin-bottom: 32px; }
    .cta-actions { display: flex; gap: 16px; justify-content: center; }
    .btn-cta {
      background: white;
      color: var(--primary-dark);
      border: none;
      padding: 14px 32px;
      border-radius: 28px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
    .btn-cta-outline {
      background: transparent;
      color: white;
      border: 2px solid white;
      padding: 14px 32px;
      border-radius: 28px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-cta-outline:hover { background: rgba(255,255,255,0.1); }

    .landing-footer {
      padding: 32px 80px;
      background: var(--card);
      border-top: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .footer-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      color: var(--primary);
    }
    .landing-footer p { font-size: 13px; color: var(--text-muted); }
  `]
})
export class LandingComponent {}
