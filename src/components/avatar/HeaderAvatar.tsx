import { Link } from 'react-router-dom';
import { AppAvatar } from './AppAvatar';
import { useAppSettings } from '@/hooks/useAppSettings';
import type { AvatarContext } from './avatarContextConfig';

export function HeaderAvatar({ context, size = 64 }: { context: AvatarContext; size?: number }) {
  const { get, loaded } = useAppSettings();
  const photo = get('profilePhoto');

  if (!loaded) return null;

  if (photo) {
    return (
      <Link to="/parametres" className="shrink-0" aria-label="Profil">
        <img
          src={photo}
          alt="Profil"
          className="rounded-full object-cover border-2 border-electric-500/40"
          style={{ width: size * 0.75, height: size * 0.75 }}
        />
      </Link>
    );
  }

  return (
    <Link to="/parametres" aria-label="Profil">
      <AppAvatar context={context} size={size} />
    </Link>
  );
}
