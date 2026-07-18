import { Type, Check } from 'lucide-react';
import { useAppearance } from '@/hooks/useAppearance';

export function TypographySection() {
  const { scale, styleName, setFontScale, setFontStyle, sizePresets, stylePresets } = useAppearance();

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-white mb-1">
        <Type className="w-4 h-4" />
        <span>Typographie</span>
      </div>
      <p className="text-xs text-muted mb-4">
        Ajuste la taille et le style du texte dans toute l'app.
      </p>

      <p className="text-xs text-muted mb-2">Taille</p>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {sizePresets.map((p) => {
          const active = scale === p.scale;
          return (
            <button
              key={p.scale}
              onClick={() => setFontScale(p.scale)}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-lg border transition-colors ${
                active ? 'border-white/50' : 'border-base-600 hover:border-white/20'
              }`}
            >
              {active && <Check className="w-3 h-3 text-white" />}
              <span className="text-[10px] text-muted">{p.name}</span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted mb-2">Style</p>
      <div className="grid grid-cols-3 gap-2">
        {stylePresets.map((p) => {
          const active = styleName === p.name;
          return (
            <button
              key={p.name}
              onClick={() => setFontStyle(p.name)}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-lg border transition-colors ${
                active ? 'border-white/50' : 'border-base-600 hover:border-white/20'
              }`}
            >
              {active && <Check className="w-3 h-3 text-white" />}
              <span className="text-[10px] text-muted" style={{ fontFamily: p.body }}>
                {p.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
