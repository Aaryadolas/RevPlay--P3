# RevPlay Frontend

Angular music streaming platform frontend for RevPlay.

## Prerequisites

- Node.js 18+
- npm 9+
- Angular CLI 17

## Installation

```bash
# Install Angular CLI globally
npm install -g @angular/cli@17

# Install dependencies
npm install
```

## Run Locally

```bash
# Start development server
ng serve

# Open browser at
http://localhost:4200
```

## Build for Production

```bash
ng build --configuration production
```

## Run with Docker

```bash
# Build Docker image
docker build -t revplay-frontend .

# Run container
docker run -p 80:80 revplay-frontend

# Open browser at
http://localhost
```

## Environment

The API URL is configured in:
```
src/environments/environment.ts        (development)
src/environments/environment.prod.ts   (production)
```

Default API URL: `http://localhost:8080`

## Project Structure

```
src/app/
├── components/
│   ├── navbar/
│   ├── sidebar/
│   ├── player/
│   └── song-card/
├── pages/
│   ├── landing/
│   ├── login/
│   ├── register/
│   ├── library/
│   ├── favorites/
│   ├── playlists/
│   ├── history/
│   ├── explore/
│   ├── my-stats/
│   ├── browse-genre/
│   ├── browse-artist/
│   ├── browse-album/
│   └── artist/
│       ├── dashboard/
│       ├── my-songs/
│       ├── albums/
│       ├── upload-song/
│       ├── analytics/
│       └── profile/
├── services/
├── guards/
├── interceptors/
└── models/
```

## Features

- 🎵 Music Library with search and filters
- ❤️ Favorites management
- 🎶 Playlist creation and management
- 🕐 Listening history
- 🌍 Explore public playlists
- 📊 Personal statistics
- 🎸 Browse by Genre
- 🎤 Browse by Artist
- 💿 Browse by Album
- 🎹 Artist Dashboard
- ⬆️ Song Upload
- 📈 Artist Analytics
- 👤 Artist Profile management
- 🎧 Bottom music player
