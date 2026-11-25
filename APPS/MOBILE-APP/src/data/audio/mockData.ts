import { Track, Playlist } from '../../types/audio';

// Fallback images
const IMG_MANTRA = 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=800&auto=format&fit=crop';
const IMG_AARTI = 'https://images.unsplash.com/photo-1574519961608-512fb10d3221?q=80&w=800&auto=format&fit=crop';
const IMG_MEDITATION = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop';

export const MOCK_TRACKS: Track[] = [
  { id: 't1', title: 'Morning Suprabhatam', artist: 'Temple Priest', duration: 1200, coverUrl: IMG_MANTRA, category: 'Aarti' },
  { id: 't2', title: 'Hanuman Chalisa', artist: 'Hari Om Sharan', duration: 600, coverUrl: IMG_AARTI, category: 'Bhajans' },
  { id: 't3', title: 'Vishnu Sahasranamam', artist: 'M.S. Subbulakshmi', duration: 1800, coverUrl: IMG_MANTRA, category: 'Mantras' },
  { id: 't4', title: 'Om Namah Shivaya Chant', artist: 'Meditation Chorus', duration: 3600, coverUrl: IMG_MEDITATION, category: 'Meditation' },
  { id: 't5', title: 'Ganesha Pancharatnam', artist: 'Temple Choir', duration: 300, coverUrl: IMG_MANTRA, category: 'Slokas' },
];

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'p1',
    title: 'Morning Prayers',
    description: 'Start your day with divine blessings.',
    coverUrl: IMG_MANTRA,
    tracks: [MOCK_TRACKS[0], MOCK_TRACKS[4], MOCK_TRACKS[2]],
  },
  {
    id: 'p2',
    title: 'Evening Aarti',
    description: 'Daily evening rituals and aarti songs.',
    coverUrl: IMG_AARTI,
    tracks: [MOCK_TRACKS[1], MOCK_TRACKS[3]],
  },
  {
    id: 'p3',
    title: 'Meditation Collection',
    description: 'Deep focus and spiritual meditation.',
    coverUrl: IMG_MEDITATION,
    tracks: [MOCK_TRACKS[3]],
  }
];

export const AUDIO_CATEGORIES = ['All', 'Aarti', 'Mantras', 'Bhajans', 'Slokas', 'Meditation', 'Discourses', 'Live'];
