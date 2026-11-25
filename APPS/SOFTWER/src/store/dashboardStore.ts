import { create } from 'zustand';
import api from '../services/api';
import { socket, connectSocket, disconnectSocket } from '../services/socket';

interface DashboardStats {
  // Core
  todaysRevenue: number;
  todaysVisitors: number;
  laddusSold: number;
  ladduRevenue: number;
  pendingPoojas: number;
  monthlyRevenue: number;

  // Ticket breakdown
  entryTicketCount: number;
  darshanTicketCount: number;
  entryRevenue: number;
  darshanRevenue: number;

  // Donations
  donationRevenue: number;
  donationCount: number;

  // Accountant
  cashCollection: number;
  onlineCollection: number;
  totalCollection: number;

  // Charts
  hourlyData: { time: string; amount: number }[];
  weeklyRevenue: { _id: string; amount: number }[];
  moduleRevenueData: { name: string; value: number; color: string }[];
  collectionData: { name: string; value: number; color: string }[];

  // Recent
  recentReceipts: any[];
  dynamicSectionsData?: Record<string, { count: number, revenue: number }>;
}

interface DashboardState {
  stats: DashboardStats;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  fetchStats: () => Promise<void>;
  initializeRealtime: () => void;
  cleanupRealtime: () => void;
}

const defaultStats: DashboardStats = {
  todaysRevenue: 0,
  todaysVisitors: 0,
  laddusSold: 0,
  ladduRevenue: 0,
  pendingPoojas: 0,
  monthlyRevenue: 0,
  entryTicketCount: 0,
  darshanTicketCount: 0,
  entryRevenue: 0,
  darshanRevenue: 0,
  donationRevenue: 0,
  donationCount: 0,
  cashCollection: 0,
  onlineCollection: 0,
  totalCollection: 0,
  hourlyData: [],
  weeklyRevenue: [],
  moduleRevenueData: [],
  collectionData: [],
  recentReceipts: [],
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: defaultStats,
  isLoading: false,
  error: null,
  lastUpdated: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/dashboard/stats');
      if (response.data.success) {
        set({ 
          stats: { ...defaultStats, ...response.data.data }, 
          isLoading: false,
          lastUpdated: new Date()
        });
      } else {
        set({ error: 'Failed to fetch stats', isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  initializeRealtime: () => {
    connectSocket();
    socket.on('DASHBOARD_UPDATE', () => {
      get().fetchStats();
    });
    get().fetchStats();
  },

  cleanupRealtime: () => {
    socket.off('DASHBOARD_UPDATE');
    disconnectSocket();
  }
}));
