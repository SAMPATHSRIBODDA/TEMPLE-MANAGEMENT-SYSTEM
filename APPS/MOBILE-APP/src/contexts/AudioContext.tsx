import React, { createContext, useContext, useState, useEffect } from 'react';
import { Track, AudioContextState } from '../types/audio';

const AudioContext = createContext<AudioContextState | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [progress, setProgress] = useState(0);

  // Mock progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= currentTrack.duration) {
            setIsPlaying(false);
            return currentTrack.duration;
          }
          return p + 1; // 1 second step
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const playTrack = (track: Track, newQueue?: Track[]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    if (newQueue) setQueue(newQueue);
  };

  const pause = () => setIsPlaying(false);
  const resume = () => {
    if (currentTrack) setIsPlaying(true);
  };
  
  const next = () => {
    if (queue.length > 0) {
      const currentIdx = queue.findIndex(t => t.id === currentTrack?.id);
      if (currentIdx !== -1 && currentIdx < queue.length - 1) {
        playTrack(queue[currentIdx + 1]);
      }
    }
  };

  const previous = () => {
    if (progress > 5) {
      setProgress(0);
    } else if (queue.length > 0) {
      const currentIdx = queue.findIndex(t => t.id === currentTrack?.id);
      if (currentIdx > 0) {
        playTrack(queue[currentIdx - 1]);
      }
    }
  };

  const seek = (seconds: number) => {
    if (currentTrack) {
      setProgress(Math.max(0, Math.min(seconds, currentTrack.duration)));
    }
  };

  const toggleFullScreen = (isOpen: boolean) => {
    setIsFullScreen(isOpen);
  };

  return (
    <AudioContext.Provider value={{
      currentTrack, isPlaying, queue, isFullScreen, progress,
      playTrack, pause, resume, next, previous, seek, toggleFullScreen
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
