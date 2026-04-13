import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GuideLevel = 'novice' | 'intermediate' | 'expert' | 'off';

interface GuideState {
  level: GuideLevel | null;
  darkMode: boolean;
  setLevel: (level: GuideLevel) => void;
  toggleDark: () => void;
}

export const useGuideStore = create<GuideState>()(
  persist(
    (set) => ({
      level: null,
      darkMode: false,
      setLevel: (level) => set({ level }),
      toggleDark: () =>
        set((s) => {
          const next = !s.darkMode;
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', next);
          }
          return { darkMode: next };
        }),
    }),
    {
      name: 'switchbook-guide',
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode && typeof document !== 'undefined') {
          document.documentElement.classList.add('dark');
        }
      },
    },
  ),
);
