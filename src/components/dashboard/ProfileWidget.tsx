import { User } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';

export function ProfileWidget() {
  const { get, loaded } = useAppSettings();
  const photo = get('profilePhoto');
  const name = get('profileName') ?? '';

  if (!loaded) return null;

  return (
    <div className="glass-card p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-electric-500 shadow-glow flex items-center justify-center overflow-hidden shrink-0">
        {photo ? (
          <img src={photo} alt="Photo de profil" className="w-full h-full object-cover" />
        ) : (
          <User className="w-5 h-5 text-onAccent" />
        )}
      </div>
      <div>
        <p className="text-white font-medium text-sm">{name || 'Ton nom'}</p>
        <p className="text-muted text-xs">Bienvenue sur Veyrion</p>
      </div>
    </div>
  );
}
