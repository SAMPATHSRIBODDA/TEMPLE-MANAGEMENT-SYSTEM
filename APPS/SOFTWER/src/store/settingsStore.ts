import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  printerType: '58mm' | '80mm';
  defaultPrinter: string;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setPrinterType: (type: '58mm' | '80mm') => void;
  setDefaultPrinter: (printer: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      printerType: '80mm',
      defaultPrinter: 'Microsoft Print to PDF',
      setTheme: (theme) => set({ theme }),
      setPrinterType: (type) => set({ printerType: type }),
      setDefaultPrinter: (printer) => set({ defaultPrinter: printer }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
