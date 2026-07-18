import { Palette, Check } from 'lucide-react';
import { useAccentColor } from '@/hooks/useAccentColor';

function hexToRgbString(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r} ${g} ${b}`;
}

function rgbStringToHex(rgb: string): string {
  const [r, g, b] = rgb.split(' ').map((n) => parseInt(n, 10));
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function AccentColorSection() {
  const { current, setAccent, presets } = useAccentColor();
  const isCustom = !presets.some((p) => p.rgb === current);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-white mb-1">
        <Palette className="w-4 h-4" />
        <span>Couleur d'accent</span>
      </div>
      <p className="text-xs text-muted mb-4">
        Change la couleur utilisée pour les icônes, boutons et éléments actifs dans toute l'app.
      </p>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {presets.map((p) => {
          const active = current === p.rgb;
          return (
            <button
              key={p.rgb}
              onClick={() => setAccent(p.rgb)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-lg border transition-colors ${
                active ? 'border-white/50' : 'border-base-600 hover:border-white/20'
              }`}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: p.hex }}
              >
                {active && <Check className="w-3.5 h-3.5 text-white" />}
              </span>
              <span className="text-[10px] text-muted">{p.name}</span>
            </button>
          );
        })}
      </div>

      <label
        className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
          isCustom ? 'border-white/50' : 'border-base-600 hover:border-white/20'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: isCustom ? rgbStringToHex(current) : '#888' }}
          >
            {isCustom && <Check className="w-3.5 h-3.5 text-white" />}
          </span>
          <span className="text-sm text-white">Couleur personnalisée</span>
        </div>
        <input
          type="color"
          value={isCustom ? rgbStringToHex(current) : '#888888'}
          onChange={(e) => setAccent(hexToRgbString(e.target.value))}
          className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
        />
      </label>
    </div>
  );
}
