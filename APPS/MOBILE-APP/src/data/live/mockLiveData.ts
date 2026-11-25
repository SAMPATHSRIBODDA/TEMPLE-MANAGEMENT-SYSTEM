import { LiveStream } from '../../types/live';

const IMG_AARTI = 'https://images.unsplash.com/photo-1574519961608-512fb10d3221?q=80&w=800&auto=format&fit=crop';
const IMG_FESTIVAL = 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop';
const IMG_TEMPLE = 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=800&auto=format&fit=crop';

export const MOCK_LIVE_STREAMS: LiveStream[] = [
  {
    id: 'l1',
    title: 'Daily Morning Aarti Live',
    description: 'Join the sacred morning Suprabhatam and Aarti directly from the inner sanctum.',
    state: 'LIVE',
    thumbnailUrl: IMG_AARTI,
    viewerCount: 1405,
    category: 'Daily Aarti',
    videoUrl: 'mock_hls_stream_url'
  },
  {
    id: 'l2',
    title: 'Maha Shivaratri Special Pooja',
    description: 'The grand evening celebration featuring Abhishekam.',
    state: 'UPCOMING',
    thumbnailUrl: IMG_FESTIVAL,
    scheduledTime: 'Today, 6:00 PM',
    category: 'Festival',
  },
  {
    id: 'l3',
    title: 'Sunday Vahana Seva',
    description: 'The deity is taken out on the Garuda Vahanam.',
    state: 'UPCOMING',
    thumbnailUrl: IMG_TEMPLE,
    scheduledTime: 'Sunday, 7:00 AM',
    category: 'Special Event',
  },
  {
    id: 'l4',
    title: 'Evening Deeparadhana (VOD)',
    description: 'Catch up on yesterday\'s beautiful evening deeparadhana.',
    state: 'ENDED',
    thumbnailUrl: IMG_AARTI,
    viewerCount: 12500, // total views
    category: 'Daily Aarti',
    videoUrl: 'mock_vod_url'
  }
];
