import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Song } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private currentSongSubject = new BehaviorSubject<Song | null>(null);
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private queueSubject = new BehaviorSubject<Song[]>([]);
  private currentIndexSubject = new BehaviorSubject<number>(0);
  private volumeSubject = new BehaviorSubject<number>(1);

  currentSong$ = this.currentSongSubject.asObservable();
  isPlaying$ = this.isPlayingSubject.asObservable();
  queue$ = this.queueSubject.asObservable();
  volume$ = this.volumeSubject.asObservable();

  private audio = new Audio();

  constructor() {
    this.audio.addEventListener('ended', () => this.next());
    this.audio.addEventListener('volumechange', () => {
      this.volumeSubject.next(this.audio.volume);
    });
  }

  playSong(song: Song, queue?: Song[]): void {
    if (queue) {
      this.queueSubject.next(queue);
      const index = queue.findIndex(s => s.id === song.id);
      this.currentIndexSubject.next(index >= 0 ? index : 0);
    }
    this.currentSongSubject.next(song);
    if (song.audioUrl) {
      this.audio.src = song.audioUrl;
      this.audio.play().catch(() => {});
      this.isPlayingSubject.next(true);
    }
  }

  togglePlay(): void {
    if (this.isPlayingSubject.value) {
      this.audio.pause();
      this.isPlayingSubject.next(false);
    } else {
      this.audio.play().catch(() => {});
      this.isPlayingSubject.next(true);
    }
  }

  next(): void {
    const queue = this.queueSubject.value;
    const currentIndex = this.currentIndexSubject.value;
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      this.currentIndexSubject.next(nextIndex);
      this.playSong(queue[nextIndex]);
    }
  }

  previous(): void {
    const queue = this.queueSubject.value;
    const currentIndex = this.currentIndexSubject.value;
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      this.currentIndexSubject.next(prevIndex);
      this.playSong(queue[prevIndex]);
    }
  }

  setVolume(volume: number): void {
    this.audio.volume = volume;
    this.volumeSubject.next(volume);
  }

  getCurrentTime(): number {
    return this.audio.currentTime;
  }

  getDuration(): number {
    return this.audio.duration || 0;
  }

  seekTo(time: number): void {
    this.audio.currentTime = time;
  }

  getCurrentSong(): Song | null {
    return this.currentSongSubject.value;
  }

  isPlaying(): boolean {
    return this.isPlayingSubject.value;
  }
}
