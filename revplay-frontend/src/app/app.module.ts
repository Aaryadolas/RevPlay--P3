import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PlayerComponent } from './components/player/player.component';
import { SongCardComponent } from './components/song-card/song-card.component';

import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { LibraryComponent } from './pages/library/library.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { PlaylistsComponent } from './pages/playlists/playlists.component';
import { HistoryComponent } from './pages/history/history.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { MyStatsComponent } from './pages/my-stats/my-stats.component';
import { BrowseGenreComponent } from './pages/browse-genre/browse-genre.component';
import { BrowseArtistComponent } from './pages/browse-artist/browse-artist.component';
import { BrowseAlbumComponent } from './pages/browse-album/browse-album.component';
import { ArtistDashboardComponent } from './pages/artist/dashboard/dashboard.component';
import { MySongsComponent } from './pages/artist/my-songs/my-songs.component';
import { AlbumsComponent } from './pages/artist/albums/albums.component';
import { UploadSongComponent } from './pages/artist/upload-song/upload-song.component';
import { ArtistAnalyticsComponent } from './pages/artist/analytics/analytics.component';
import { ArtistProfileComponent } from './pages/artist/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    PlayerComponent,
    SongCardComponent,
    LandingComponent,
    LoginComponent,
    RegisterComponent,
    LibraryComponent,
    FavoritesComponent,
    PlaylistsComponent,
    HistoryComponent,
    ExploreComponent,
    MyStatsComponent,
    BrowseGenreComponent,
    BrowseArtistComponent,
    BrowseAlbumComponent,
    ArtistDashboardComponent,
    MySongsComponent,
    AlbumsComponent,
    UploadSongComponent,
    ArtistAnalyticsComponent,
    ArtistProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
