import { useEffect } from 'react';
import { useAppSettings } from './useAppSettings';

export const ACCENT_PRESETS: { name: string; rgb: string; hex: string }[] = [
  { name: 'Cyan néon', rgb: '34 211 238', hex: '#22D3EE' },
  { name: 'Violet néon', rgb: '168 85 247', hex: '#A855F7' },
  { name: 'Magenta', rgb: '236 72 220', hex: '#EC48DC' },
  { name: 'Bleu électrique', rgb: '61 139 255', hex: '#3D8BFF' },
  { name: 'Vert', rgb: '46 212 122', hex: '#2ED47A' },
  { name: 'Laiton', rgb: '201 162 39', hex: '#C9A227' },
  { name: 'Platine', rgb: '184 188 194', hex: '#B8BCC2' },
  { name: 'Rose', rgb: '255 84 112', hex: '#FF5470' },
  { name: 'Orange', rgb: '245 158 66', hex: '#F59E42' },
];

const SETTING_KEY = 'accentColor';

// Une couleur d'accent vive (ex: laiton, contraste ~2:1) devient illisible
// sur fond clair — on l'assombrit de 35% en mode clair pour repasser au-dessus
// du seuil de lisibilité WCAG AA (~4.5:1), sans toucher au mode sombre où le
// contraste sur fond quasi-noir est déjà largement suffisant.
function darken(rgb: string, factor: number): string {
  return rgb
    .split(' ')
    .map((n) => Math.round(Number(n) * factor))
    .join(' ');
}

function isLightMode(): boolean {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('light');
}

export function useAccentColor() {
  const { get, set, loaded } = useAppSettings();
  const current = get(SETTING_KEY) ?? ACCENT_PRESETS[0].rgb;

  useEffect(() => {
    if (!loaded) return;

    const apply = () => {
      const value = isLightMode() ? darken(current, 0.65) : current;
      document.documentElement.style.setProperty('--color-accent', value);
    };

    apply();

    // Réagit aussi à un changement de thème (Sombre/Clair/Auto) sans
    // changement de couleur, puisque ThemeProvider ne fait que basculer une
    // classe CSS sur <html> plutôt que déclencher ce hook directement.
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [current, loaded]);

  async function setAccent(rgb: string) {
    await set(SETTING_KEY, rgb);
  }

  return { current, setAccent, presets: ACCENT_PRESETS };
}
