export type LiveStreamState = 'LIVE' | 'UPCOMING' | 'ENDED';

export interface LiveStream {
  id: string;
  title: string;
  description: string;
  state: LiveStreamState;
  thumbnailUrl: string;
  viewerCount?: number;
  scheduledTime?: string;
  category: string;
  videoUrl?: string; // For future HLS/RTMP/YouTube integration
}
