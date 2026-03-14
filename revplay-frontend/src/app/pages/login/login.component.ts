import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-brand" routerLink="/">
          <span>🎵</span>
          <span>RevPlay</span>
        </div>
        <h1 class="auth-title">Welcome back</h1>
        <p class="auth-subtitle">Login to continue your music journey</p>

        <div class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input
              type="email"
              class="input-field"
              placeholder="Enter your email"
              formControlName="email"
            />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              class="input-field"
              placeholder="Enter your password"
              formControlName="password"
            />
          </div>
          <button type="submit" class="btn-submit" [disabled]="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <p class="auth-footer">
          New user?
          <a routerLink="/register" class="auth-link">Register here</a>
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
    .auth-title {
      font-size: 26px;
      font-weight: 800;
      text-align: center;
      margin-bottom: 8px;
    }
    .auth-subtitle {
      font-size: 14px;
      color: var(--text-secondary);
      text-align: center;
      margin-bottom: 28px;
    }
    .error-msg {
      background: #FEF2F2;
      color: #EF4444;
      padding: 12px 16px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      margin-bottom: 16px;
      border: 1px solid #FECACA;
    }
    .form-group { margin-bottom: 16px; }
    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 6px;
    }
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
      margin-top: 8px;
      transition: all 0.2s;
    }
    .btn-submit:hover:not(:disabled) { background: var(--primary-dark); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .auth-footer {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: var(--text-secondary);
    }
    .auth-link { color: var(--primary); font-weight: 600; }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.authService.login(this.loginForm.value).subscribe({
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
        this.errorMsg = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}
