import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, ArtistGuard } from './guards/auth.guard';

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

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'library', component: LibraryComponent },
  { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard] },
  { path: 'playlists', component: PlaylistsComponent, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'explore', component: ExploreComponent },
  { path: 'my-stats', component: MyStatsComponent, canActivate: [AuthGuard] },
  { path: 'browse-genre', component: BrowseGenreComponent },
  { path: 'browse-artist', component: BrowseArtistComponent },
  { path: 'browse-album', component: BrowseAlbumComponent },
  { path: 'artist/dashboard', component: ArtistDashboardComponent, canActivate: [AuthGuard, ArtistGuard] },
  { path: 'artist/my-songs', component: MySongsComponent, canActivate: [AuthGuard, ArtistGuard] },
  { path: 'artist/albums', component: AlbumsComponent, canActivate: [AuthGuard, ArtistGuard] },
  { path: 'artist/upload', component: UploadSongComponent, canActivate: [AuthGuard, ArtistGuard] },
  { path: 'artist/analytics', component: ArtistAnalyticsComponent, canActivate: [AuthGuard, ArtistGuard] },
  { path: 'artist/profile', component: ArtistProfileComponent, canActivate: [AuthGuard, ArtistGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
