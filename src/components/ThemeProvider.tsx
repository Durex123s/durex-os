import { useEffect, type ReactNode } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeMode = useAppStore((s) => s.themeMode);

  useEffect(() => {
    const root = document.documentElement;
    const applyResolved = (isLight: boolean) => {
      root.classList.toggle('light', isLight);
    };

    if (themeMode === 'light') {
      applyResolved(true);
      return;
    }
    if (themeMode === 'dark') {
      applyResolved(false);
      return;
    }

    const mql = window.matchMedia('(prefers-color-scheme: light)');
    applyResolved(mql.matches);
    const listener = (e: MediaQueryListEvent) => applyResolved(e.matches);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, [themeMode]);

  return <>{children}</>;
}
