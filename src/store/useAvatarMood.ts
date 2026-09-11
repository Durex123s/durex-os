import { create } from 'zustand';

export type AvatarMood = 'neutral' | 'happy' | 'proud' | 'encourage';

interface AvatarMoodState {
  mood: AvatarMood;
  message: string | null;
  celebrate: (message: string, mood?: AvatarMood) => void;
}

let clearTimer: ReturnType<typeof setTimeout> | null = null;

// Petit store global : n'importe quel hook métier (tâches, habitudes,
// épargne, Pomodoro) peut appeler celebrate() pour faire réagir l'avatar
// pendant quelques secondes, sans avoir à passer par un Context React.
export const useAvatarMood = create<AvatarMoodState>((set) => ({
  mood: 'neutral',
  message: null,
  celebrate: (message, mood = 'happy') => {
    if (clearTimer) clearTimeout(clearTimer);
    set({ mood, message });
    clearTimer = setTimeout(() => {
      set({ mood: 'neutral', message: null });
    }, 4000);
  },
}));
