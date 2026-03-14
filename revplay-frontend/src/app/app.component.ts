import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <app-navbar *ngIf="showLayout"></app-navbar>
      <div class="main-wrapper" *ngIf="showLayout">
        <app-sidebar></app-sidebar>
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
      <div *ngIf="!showLayout">
        <router-outlet></router-outlet>
      </div>
      <app-player *ngIf="showLayout"></app-player>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #FAFAFF;
    }
    .main-wrapper {
      display: flex;
      flex: 1;
      padding-bottom: 90px;
    }
    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }
  `]
})
export class AppComponent implements OnInit {
  showLayout = true;
  noLayoutRoutes = ['/login', '/register', '/'];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showLayout = !this.noLayoutRoutes.includes(event.url);
      }
    });
  }
}
