import { create } from 'zustand';

export interface SyncJob {
  id: string;
  type: 'ENTRY_TICKET' | 'DARSHAN_BOOKING' | 'LADDU_SALE' | 'SHIFT_CLOSE';
  payload: any;
  timestamp: string;
  status: 'PENDING' | 'SYNCING' | 'FAILED';
  error?: string;
}

interface SyncState {
  queue: SyncJob[];
  isSyncing: boolean;
  addToQueue: (type: SyncJob['type'], payload: any) => void;
  processQueue: () => Promise<void>;
  clearQueue: () => void;
}

export const useSyncStore = create<SyncState>((set, get) => ({
  queue: [],
  isSyncing: false,
  
  addToQueue: (type, payload) => {
    const newJob: SyncJob = {
      id: `SYNC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      payload,
      timestamp: new Date().toISOString(),
      status: 'PENDING'
    };
    set((state) => ({ queue: [...state.queue, newJob] }));
  },

  processQueue: async () => {
    const { queue, isSyncing } = get();
    if (isSyncing || queue.length === 0) return;

    set({ isSyncing: true });

    // Mock processing each job with a delay
    for (let i = 0; i < queue.length; i++) {
      const job = queue[i];
      if (job.status === 'PENDING' || job.status === 'FAILED') {
        set((state) => ({
          queue: state.queue.map(q => q.id === job.id ? { ...q, status: 'SYNCING' } : q)
        }));

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Remove from queue on success
          set((state) => ({
            queue: state.queue.filter(q => q.id !== job.id)
          }));
        } catch (error: any) {
          // Mark as failed
          set((state) => ({
            queue: state.queue.map(q => q.id === job.id ? { ...q, status: 'FAILED', error: error.message } : q)
          }));
        }
      }
    }

    set({ isSyncing: false });
  },

  clearQueue: () => set({ queue: [] })
}));
