import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DarshanType {
  id: string;
  name: string;
  price: number;
}

export interface DarshanBooking {
  id: string;
  darshanType: DarshanType;
  date: string;
  slot: string;
  persons: number;
  total: number;
  cashReceived: number;
  change: number;
  timestamp: string;
}

interface DarshanState {
  darshanHistory: DarshanBooking[];
  saveBooking: (booking: DarshanBooking) => void;
  addDarshanBooking: (booking: DarshanBooking) => void;
  clearHistory: () => void;
}

export const useDarshanStore = create<DarshanState>()(
  persist(
    (set) => ({
      darshanHistory: [],
      saveBooking: (booking) => {
        set((state) => ({
          darshanHistory: [booking, ...state.darshanHistory]
        }));
      },
      addDarshanBooking: (booking) => set((state) => ({
        darshanHistory: [booking, ...state.darshanHistory]
      })),
      clearHistory: () => set({ darshanHistory: [] })
    }),
    {
      name: 'darshan-storage',
    }
  )
);
