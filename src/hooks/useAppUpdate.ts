import { create } from 'zustand';

interface AppUpdateState {
  updateAvailable: boolean;
  applyUpdate: (() => void) | null;
  setUpdateAvailable: (apply: () => void) => void;
  dismiss: () => void;
}

export const useAppUpdate = create<AppUpdateState>((set) => ({
  updateAvailable: false,
  applyUpdate: null,
  setUpdateAvailable: (apply) => set({ updateAvailable: true, applyUpdate: apply }),
  dismiss: () => set({ updateAvailable: false }),
}));
