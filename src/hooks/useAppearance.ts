import { useEffect } from 'react';
import { useAppSettings } from './useAppSettings';

export const FONT_SIZE_PRESETS: { name: string; scale: string }[] = [
  { name: 'Petit', scale: '0.9' },
  { name: 'Normal', scale: '1' },
  { name: 'Grand', scale: '1.1' },
  { name: 'Très grand', scale: '1.25' },
];

export const FONT_STYLE_PRESETS: { name: string; display: string; body: string }[] = [
  { name: 'Classique', display: `'Fraunces', serif`, body: `'Inter', sans-serif` },
  { name: 'Épuré', display: `'Inter', sans-serif`, body: `'Inter', sans-serif` },
  { name: 'Mono', display: `'JetBrains Mono', monospace`, body: `'JetBrains Mono', monospace` },
];

const SCALE_KEY = 'fontScale';
const STYLE_KEY = 'fontStyle';

export function useAppearance() {
  const { get, set, loaded } = useAppSettings();
  const scale = get(SCALE_KEY) ?? FONT_SIZE_PRESETS[1].scale;
  const styleName = get(STYLE_KEY) ?? FONT_STYLE_PRESETS[0].name;
  const style = FONT_STYLE_PRESETS.find((s) => s.name === styleName) ?? FONT_STYLE_PRESETS[0];

  useEffect(() => {
    if (!loaded) return;
    document.documentElement.style.setProperty('--font-scale', scale);
  }, [scale, loaded]);

  useEffect(() => {
    if (!loaded) return;
    document.documentElement.style.setProperty('--font-display', style.display);
    document.documentElement.style.setProperty('--font-body', style.body);
  }, [style, loaded]);

  async function setFontScale(value: string) {
    await set(SCALE_KEY, value);
  }

  async function setFontStyle(name: string) {
    await set(STYLE_KEY, name);
  }

  return { scale, styleName, setFontScale, setFontStyle, sizePresets: FONT_SIZE_PRESETS, stylePresets: FONT_STYLE_PRESETS };
}
