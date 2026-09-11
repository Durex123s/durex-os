import { create } from 'zustand';
import { TEMPORARY_STATES, STATE_PRIORITY, type CharacterState } from '@/character/states';

interface ReactOptions {
  duration?: number;
}

interface CharacterStore {
  state: CharacterState;
  permanentState: CharacterState;
  activePriority: number;
  setPermanentState: (state: CharacterState) => void;
  /** Alias pratique : équivaut à react(state) avec la durée par défaut de l'état. */
  setCharacterState: (state: CharacterState) => void;
  /** Réaction ponctuelle, avec système de priorité : une réaction plus
   * importante peut interrompre une réaction en cours, mais pas l'inverse. */
  react: (state: CharacterState, options?: ReactOptions) => void;
}

let revertTimer: ReturnType<typeof setTimeout> | null = null;

export const useCharacter = create<CharacterStore>((set, get) => ({
  state: 'idle',
  permanentState: 'idle',
  activePriority: 0,

  setPermanentState: (state) => {
    if (revertTimer) {
      clearTimeout(revertTimer);
      revertTimer = null;
    }
    set({ state, permanentState: state, activePriority: 0 });
  },

  setCharacterState: (state) => get().react(state),

  react: (state, options) => {
    const priority = STATE_PRIORITY[state] ?? 0;
    const { activePriority } = get();
    // Une réaction déjà affichée avec une priorité supérieure ne doit pas
    // être coupée par une réaction moins importante (ex: "joy" ne doit
    // pas interrompre un "big_success" en cours).
    if (revertTimer && priority < activePriority) return;

    if (revertTimer) clearTimeout(revertTimer);
    set({ state, activePriority: priority });

    const duration = options?.duration ?? TEMPORARY_STATES[state];
    if (duration) {
      revertTimer = setTimeout(() => {
        revertTimer = null;
        set((s) => ({ state: s.permanentState, activePriority: 0 }));
      }, duration);
    } else {
      revertTimer = null;
    }
  },
}));

export function useCharacterState() {
  return useCharacter((s) => s.state);
}
