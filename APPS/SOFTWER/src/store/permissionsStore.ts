import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const ALL_ROLES = ['Temple Admin', 'Accountant', 'Counter Staff'];
export const ALL_PERMISSIONS = ['Dashboard', 'Tickets', 'Laddus', 'Poojas', 'Reports', 'Inventory', 'Settings'];

export type PermissionMatrix = Record<string, Record<string, boolean>>;

const defaultMatrix: PermissionMatrix = {
  'Temple Admin': { 'Dashboard': true, 'Tickets': true, 'Laddus': true, 'Poojas': true, 'Reports': true, 'Inventory': true, 'Settings': true },
  'Accountant': { 'Dashboard': true, 'Tickets': false, 'Laddus': false, 'Poojas': false, 'Reports': true, 'Inventory': false, 'Settings': false },
  'Counter Staff': { 'Dashboard': true, 'Tickets': true, 'Laddus': true, 'Poojas': true, 'Reports': false, 'Inventory': false, 'Settings': false },
};

interface PermissionsState {
  matrix: PermissionMatrix;
  togglePermission: (role: string, perm: string) => void;
  hasPermission: (role: string, perm: string) => boolean;
}

export const usePermissionsStore = create<PermissionsState>()(
  persist(
    (set, get) => ({
      matrix: defaultMatrix,
      
      togglePermission: (role, perm) => {
        set((state) => ({
          matrix: {
            ...state.matrix,
            [role]: {
              ...(state.matrix[role] || {}),
              [perm]: !(state.matrix[role]?.[perm])
            }
          }
        }));
      },
      
      hasPermission: (role, perm) => {
        const state = get();
        // If the role doesn't exist in matrix, default to false
        return state.matrix[role]?.[perm] ?? false;
      }
    }),
    {
      name: 'permissions-storage',
    }
  )
);
