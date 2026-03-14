import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-brand" routerLink="/">
          <span>🎵</span>
          <span>RevPlay</span>
        </div>
        <h1 class="auth-title">Create Account</h1>
        <p class="auth-subtitle">Join RevPlay and start your music journey</p>

        <div class="role-tabs">
          <button [class.active]="role === 'USER'" (click)="role = 'USER'">
            🎧 Listener
          </button>
          <button [class.active]="role === 'ARTIST'" (click)="role = 'ARTIST'">
            🎤 Artist
          </button>
        </div>

        <div class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</div>
        <div class="success-msg" *ngIf="successMsg">{{ successMsg }}</div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Username</label>
            <input type="text" class="input-field" placeholder="Choose a username" formControlName="username" />
          </div>
          <div class="form-group">
            <label>Display Name</label>
            <input type="text" class="input-field" placeholder="Your display name" formControlName="displayName" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" class="input-field" placeholder="Enter your email" formControlName="email" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" class="input-field" placeholder="Create a password" formControlName="password" />
          </div>

          <div class="role-info" [class.artist]="role === 'ARTIST'">
            <span *ngIf="role === 'USER'">🎧 You will register as a <strong>Listener</strong></span>
            <span *ngIf="role === 'ARTIST'">🎤 You will register as an <strong>Artist</strong> — you can upload music!</span>
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <p class="auth-footer">
          Already have an account?
          <a routerLink="/login" class="auth-link">Login here</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #FAFAFF 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .auth-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: 40px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 20px 60px rgba(139,92,246,0.15);
      border: 1px solid var(--border);
    }
    .auth-brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: 'Syne', sans-serif;
      font-size: 22px;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 24px;
      cursor: pointer;
    }
    .auth-title { font-size: 26px; font-weight: 800; text-align: center; margin-bottom: 8px; }
    .auth-subtitle { font-size: 14px; color: var(--text-secondary); text-align: center; margin-bottom: 24px; }
    .role-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      background: var(--background);
      padding: 4px;
      border-radius: var(--radius-sm);
    }
    .role-tabs button {
      flex: 1;
      padding: 10px;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      background: transparent;
      color: var(--text-secondary);
      transition: all 0.2s;
    }
    .role-tabs button.active {
      background: var(--primary);
      color: white;
      box-shadow: 0 4px 12px rgba(139,92,246,0.3);
    }
    .error-msg {
      background: #FEF2F2;
      color: #EF4444;
      padding: 12px 16px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      margin-bottom: 16px;
    }
    .success-msg {
      background: #F0FDF4;
      color: #22C55E;
      padding: 12px 16px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      margin-bottom: 16px;
    }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
    .role-info {
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      margin-bottom: 16px;
      background: var(--accent);
      color: var(--primary-dark);
    }
    .role-info.artist { background: #F3E8FF; }
    .btn-submit {
      width: 100%;
      background: var(--primary);
      color: white;
      border: none;
      padding: 14px;
      border-radius: var(--radius-sm);
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-submit:hover:not(:disabled) { background: var(--primary-dark); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .auth-footer { text-align: center; margin-top: 20px; font-size: 14px; color: var(--text-secondary); }
    .auth-link { color: var(--primary); font-weight: 600; }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  role: 'USER' | 'ARTIST' = 'USER';
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      displayName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    const request = this.role === 'ARTIST'
      ? this.authService.registerArtist(this.registerForm.value)
      : this.authService.register(this.registerForm.value);

    request.subscribe({
      next: (res) => {
        this.loading = false;
        if (res.role === 'ARTIST') {
          this.router.navigate(['/artist/dashboard']);
        } else {
          this.router.navigate(['/library']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
