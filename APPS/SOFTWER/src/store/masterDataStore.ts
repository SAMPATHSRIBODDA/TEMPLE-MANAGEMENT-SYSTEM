import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  darshanTypesConfig, 
  entryTicketTypesConfig, 
  ladduTypesConfig 
} from '../screens/masters/masterConfigs';

interface MasterDataState {
  // We store the array of items for each config ID
  data: Record<string, any[]>;
  updateData: (configId: string, newData: any[]) => void;
  getDarshanTypes: () => any[];
  getLadduTypes: () => any[];
  getEntryTicketTypes: () => any[];
}

export const useMasterDataStore = create<MasterDataState>()(
  persist(
    (set, get) => ({
      data: {
        'darshan-types': darshanTypesConfig.initialData,
        'entry-ticket-types': entryTicketTypesConfig.initialData,
        'laddu-types': ladduTypesConfig.initialData,
      },
      updateData: (configId, newData) => set((state) => ({
        data: {
          ...state.data,
          [configId]: newData
        }
      })),
      getDarshanTypes: () => get().data['darshan-types'] || darshanTypesConfig.initialData,
      getLadduTypes: () => get().data['laddu-types'] || ladduTypesConfig.initialData,
      getEntryTicketTypes: () => get().data['entry-ticket-types'] || entryTicketTypesConfig.initialData,
    }),
    {
      name: 'tms-master-data',
    }
  )
);
