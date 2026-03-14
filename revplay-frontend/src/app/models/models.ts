export interface User {
  id?: number;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  profilePicture?: string;
  role: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  username: string;
  email: string;
  role: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Song {
  id?: number;
  title: string;
  artistId?: number;
  artistName?: string;
  albumId?: number;
  albumName?: string;
  genre: string;
  duration?: number;
  audioUrl?: string;
  coverImage?: string;
  releaseDate?: string;
  visibility?: string;
  playCount?: number;
  createdAt?: string;
}

export interface Album {
  id?: number;
  artistId?: number;
  artistName?: string;
  albumName: string;
  description?: string;
  coverImage?: string;
  releaseDate?: string;
  songs?: Song[];
  createdAt?: string;
}

export interface Artist {
  id?: number;
  userId?: number;
  artistName: string;
  bio?: string;
  genre?: string;
  profilePicture?: string;
  bannerImage?: string;
  isActive?: boolean;
  socialLinks?: SocialLinks;
  createdAt?: string;
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  youtube?: string;
  spotify?: string;
  website?: string;
}

export interface Playlist {
  id?: number;
  userId?: number;
  name: string;
  description?: string;
  privacy?: string;
  totalSongs?: number;
  songs?: PlaylistSong[];
  createdAt?: string;
}

export interface PlaylistSong {
  id?: number;
  songId: number;
  position?: number;
  addedAt?: string;
}

export interface Favorite {
  id?: number;
  userId?: number;
  songId: number;
  createdAt?: string;
}

export interface History {
  id?: number;
  userId?: number;
  songId: number;
  listenedDuration?: number;
  playedAt?: string;
}

export interface Genre {
  id?: number;
  name: string;
}

export interface ArtistDashboard {
  totalSongs?: number;
  totalPlays?: number;
  totalFavorites?: number;
  topSongs?: Song[];
  recentSongs?: Song[];
}
