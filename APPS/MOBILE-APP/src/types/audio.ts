export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  coverUrl: string;
  category: string;
  audioUrl?: string; // For future backend
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
}

export interface AudioContextState {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  isFullScreen: boolean;
  progress: number;
  playTrack: (track: Track, queue?: Track[]) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  toggleFullScreen: (isOpen: boolean) => void;
}
