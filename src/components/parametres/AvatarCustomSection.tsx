import { Sparkles } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { AppAvatar } from '@/components/avatar/AppAvatar';

const SKIN_TONES = ['#FBCFA0', '#EAB889', '#C68863', '#8D5524'];
const HAIR_COLORS = ['#2B1D0E', '#000000', '#6B4226', '#B8860B', '#7A7A7A', '#8B0000'];

export function AvatarCustomSection() {
  const { get, set, loaded } = useAppSettings();
  const skin = get('avatarSkin') ?? SKIN_TONES[0];
  const hair = get('avatarHair') ?? HAIR_COLORS[0];

  if (!loaded) return null;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-white mb-1">
        <Sparkles className="w-4 h-4" />
        <span>Ton avatar</span>
      </div>
      <p className="text-xs text-muted mb-4">
        Personnalise ton apparence. La tenue et la posture changent automatiquement selon la page visitée.
      </p>

      <div className="flex items-center gap-4 mb-4">
        <AppAvatar context="dashboard" size={64} />
        <div className="flex-1">
          <p className="text-xs text-muted mb-1.5">Teint de peau</p>
          <div className="flex gap-2">
            {SKIN_TONES.map((c) => (
              <button
                key={c}
                onClick={() => set('avatarSkin', c)}
                className={`w-6 h-6 rounded-full border-2 ${skin === c ? 'border-white' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted mb-1.5">Couleur des cheveux</p>
      <div className="flex gap-2">
        {HAIR_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => set('avatarHair', c)}
            className={`w-6 h-6 rounded-full border-2 ${hair === c ? 'border-white' : 'border-transparent'}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
}
