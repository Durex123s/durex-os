import { useEffect, useState } from 'react';

export function useIsDarkMode() {
  const [isDark, setIsDark] = useState(
    () => !document.documentElement.classList.contains('light')
  );

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(!root.classList.contains('light'));
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}
