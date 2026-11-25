import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  role: 'Admin' | 'Accountant' | 'Counter';
}

interface AuthState {
  isAuthenticated: boolean;
  isLocked: boolean;
  user: User | null;
  shift: string | null;
  counterNumber: string | null;
  login: (user: User, shift?: string, counterNumber?: string) => void;
  logout: () => void;
  lockScreen: () => void;
  unlockScreen: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLocked: false,
      user: null,
      shift: null,
      counterNumber: null,

      login: (user, shift, counterNumber) =>
        set({ isAuthenticated: true, isLocked: false, user, shift: shift || null, counterNumber: counterNumber || null }),
      
      logout: () =>
        set({ isAuthenticated: false, isLocked: false, user: null, shift: null, counterNumber: null }),
      
      lockScreen: () => set({ isLocked: true }),
      
      unlockScreen: () => set({ isLocked: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
