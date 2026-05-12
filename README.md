# 🎵 RevPlay — Phase 3: Microservices Architecture

> A full-stack music streaming application built using Microservices Architecture, Spring Boot, Angular, Docker, and Spring Cloud.

---

## 📌 Project Overview

RevPlay Phase 3 is the most advanced phase of the RevPlay music streaming platform. The monolithic application from Phase 2 has been broken down into **independent microservices**, each responsible for a specific domain. Services communicate with each other through a centralized **API Gateway**, and service discovery is handled by **Eureka Server**.

The frontend is built using **Angular + TypeScript**, styled with **HTML and CSS**, and connects to the backend via REST APIs through the API Gateway.

---

## 🏗️ Architecture Diagram

```
                        ┌─────────────────────┐
                        │   RevPlay Frontend   │
                        │  (Angular / HTML /   │
                        │   CSS / TypeScript)  │
                        └──────────┬──────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │   API Gateway        │
                        │ (revplay-api-gateway)│
                        └──────────┬──────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
     ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
     │ User Service │    │Playlist Svc  │    │ Music Service│
     └──────────────┘    └──────────────┘    └──────────────┘
              │                    │                    │
              ▼                    ▼                    ▼
     ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
     │Artist Service│    │Favorites Svc │    │History Svc   │
     └──────────────┘    └──────────────┘    └──────────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │  Analytics Service   │
                        └─────────────────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │   Eureka Server      │
                        │ (Service Discovery)  │
                        └─────────────────────┘
```

---

## 🧩 Microservices Breakdown

| Service | Description | Port |
|---|---|---|
| `user` | Handles user registration, login, authentication, and role-based access | 8081 |
| `artist-service` | Manages artist profiles, songs, and album uploads | 8082 |
| `playlist` | Create, update, delete playlists; add/remove songs; public/private playlists | 8083 |
| `music` | Browse songs, albums, genres; simulate music playback | 8084 |
| `favorites` | Mark songs as favorites and view favorites list | 8085 |
| `history` | Track and view listening history and recently played songs | 8086 |
| `analytics-service` | View play counts, song statistics, and user engagement data | 8087 |
| `revplay-api-gateway` | Single entry point for all client requests; routes to correct microservice | 8080 |
| `eureka-server` | Service registry — all services register here for discovery | 8761 |
| `revplay-frontend` | Angular frontend — the UI layer of the application | 4200 |

---

## 🛠️ Tech Stack

### Backend
- Java 17
- Spring Boot — each microservice is a standalone Spring Boot application
- Spring Cloud Gateway — API Gateway for routing
- Spring Cloud Netflix Eureka — Service Discovery and Registration
- Spring Data JPA — ORM for database operations
- MySQL — relational database for each service
- Maven — dependency management

### Frontend
- Angular — component-based frontend framework
- TypeScript — strongly typed JavaScript
- HTML5 + CSS3 — structure and styling

### DevOps
- Docker — containerization of all services
- Docker Compose — orchestrating all containers together

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Java 17+
- Node.js 18+ and npm
- Angular CLI (`npm install -g @angular/cli`)
- Docker and Docker Compose
- MySQL 8+
- Maven 3.8+

---

### ▶️ Option 1 — Run with Docker Compose (Recommended)

This is the easiest way to run all services together.

```bash
# Clone the repository
git clone https://github.com/Aaryadolas/RevPlay--P3.git
cd RevPlay--P3

# Start all services
docker-compose up --build
```

All services will start automatically. Access the app at:
- Frontend: `http://localhost:4200`
- API Gateway: `http://localhost:8080`
- Eureka Dashboard: `http://localhost:8761`

To stop all services:
```bash
docker-compose down
```

---

### ▶️ Option 2 — Run Services Manually

**Step 1 — Start Eureka Server first (service registry)**
```bash
cd eureka-server
mvn spring-boot:run
```

**Step 2 — Start all backend microservices (in any order)**
```bash
# In separate terminals for each service:
cd user && mvn spring-boot:run
cd artist-service && mvn spring-boot:run
cd playlist && mvn spring-boot:run
cd music && mvn spring-boot:run
cd favorites && mvn spring-boot:run
cd history && mvn spring-boot:run
cd analytics-service && mvn spring-boot:run
```

**Step 3 — Start API Gateway**
```bash
cd revplay-api-gateway
mvn spring-boot:run
```

**Step 4 — Start Frontend**
```bash
cd revplay-frontend
npm install
ng serve
```

Open `http://localhost:4200` in your browser.

---

## 📂 Project Structure

```
RevPlay--P3/
│
├── eureka-server/              # Service discovery server
├── revplay-api-gateway/        # API Gateway — routes all requests
│
├── user/                       # User microservice
│   └── src/main/java/
│       ├── controller/         # REST endpoints
│       ├── service/            # Business logic
│       ├── repository/         # JPA repository
│       └── model/              # Entity classes
│
├── artist-service/             # Artist microservice
├── playlist/                   # Playlist microservice
├── music/                      # Music microservice
├── favorites/                  # Favorites microservice
├── history/                    # History microservice
├── analytics-service/          # Analytics microservice
│
├── revplay-frontend/           # Angular frontend
│   └── src/
│       ├── app/
│       │   ├── components/     # Angular components
│       │   ├── services/       # HTTP service calls
│       │   └── models/         # TypeScript interfaces
│       └── assets/             # Static files
│
└── docker-compose.yml          # Docker orchestration file
```

---

## 🔐 Features

### User Features
- Register and Login with role-based access (USER / ARTIST)
- Search songs, albums, artists, and playlists by keyword
- Browse by genre and category
- Mark songs as favorites and view favorites list
- Create public or private playlists
- Add and remove songs from playlists
- Simulate music playback (play, pause, skip)
- View recently played songs and listening history

### Artist Features
- Register as an Artist
- Create and manage Artist Profile (bio, genre, social links)
- Upload songs with details (title, genre, duration, album)
- Create albums and add songs to albums
- View play count and song statistics via Analytics Service

---

## 🌐 API Gateway Routes

All requests from the frontend go through the API Gateway at `http://localhost:8080`.

| Route | Forwards To |
|---|---|
| `/api/users/**` | User Service |
| `/api/artists/**` | Artist Service |
| `/api/playlists/**` | Playlist Service |
| `/api/music/**` | Music Service |
| `/api/favorites/**` | Favorites Service |
| `/api/history/**` | History Service |
| `/api/analytics/**` | Analytics Service |

---

## 🐳 Docker

Each microservice has its own `Dockerfile`. The `docker-compose.yml` at the root orchestrates all services together.

```yaml
# Example from docker-compose.yml
services:
  eureka-server:
    build: ./eureka-server
    ports:
      - "8761:8761"

  user:
    build: ./user
    ports:
      - "8081:8081"
    depends_on:
      - eureka-server
```

---

## 👤 My Contribution

In this group project, I was responsible for building the **Playlist Service** (`playlist/`).

My work included:
- Designing and implementing the Playlist REST API
- Create playlist with name, description, and public/private settings
- Add songs to a playlist and remove songs from a playlist
- View all playlists created by the logged-in user
- View public playlists created by other users
- Update playlist name, description, and privacy settings
- Delete a playlist
- Role-based access — only the playlist owner can update or delete it
- Integration with the API Gateway and Eureka Service Discovery

---

## 🔗 Related Phases

| Phase | Description | Tech Stack |
|---|---|---|
| Phase 1 | Console-based music app | Java, JDBC, MySQL |
| Phase 2 | Monolithic web application | Java, Spring Boot, MySQL, HTML |
| Phase 3 | Microservices application | Spring Boot, Angular, Docker, Eureka |

---

## 👥 Contributors

- Aarya Dolas — Playlist Service + Project Setup
