import { motion } from 'framer-motion';
import { CONTEXT_CONFIG, type AvatarContext } from './avatarContextConfig';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useIsDarkMode } from '@/hooks/useIsDarkMode';

const POSE_ANIMATION: Record<string, { rotate: number | number[] }> = {
  wave: { rotate: [-8, -38, -8] },
  point: { rotate: -22 },
  hold: { rotate: -12 },
  flex: { rotate: -70 },
  think: { rotate: -50 },
};

function darken(hex: string, amount = 0.35): string {
  const h = hex.replace('#', '');
  const num = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const r = Math.round(((num >> 16) & 255) * (1 - amount));
  const g = Math.round(((num >> 8) & 255) * (1 - amount));
  const b = Math.round((num & 255) * (1 - amount));
  return `rgb(${r}, ${g}, ${b})`;
}

export function AppAvatar({ context, size = 64 }: { context: AvatarContext; size?: number }) {
  const { get, loaded } = useAppSettings();
  const isDark = useIsDarkMode();
  const skin = get('avatarSkin') ?? '#F4C9A0';
  const hair = get('avatarHair') ?? '#2B1D0E';
  const { color, accessory: Accessory, pose, outfit } = CONTEXT_CONFIG[context];
  const anim = POSE_ANIMATION[pose];
  const outfitColor = isDark ? darken(color, 0.35) : color;
  const line = isDark ? '#0f172a' : '#1e1b16';

  if (!loaded) return null;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 80 80" width={size} height={size}>
        {/* Sac à dos (Études) */}
        {outfit === 'backpack' && (
          <rect x="12" y="46" width="10" height="22" rx="4" fill={isDark ? darken('#8B5A2B', 0.3) : '#8B5A2B'} stroke={line} strokeWidth="1.5" />
        )}

        {/* Halo holographique (Assistant) */}
        {outfit === 'hologram' && (
          <>
            <motion.circle
              cx="40" cy="50" r="26" fill="none" stroke="#22D3EE" strokeWidth="1.5"
              animate={{ opacity: [0.15, 0.5, 0.15], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '40px 50px' }}
            />
          </>
        )}

        {/* Corps / tenue (grand aplat webtoon) */}
        <path
          d="M24 78 Q22 48 30 42 Q40 36 50 42 Q58 48 56 78 Z"
          fill={outfitColor}
          stroke={line}
          strokeWidth="2"
        />

        {/* Cravate (Finances) */}
        {outfit === 'suit' && (
          <path d="M38 42 L42 42 L41 58 L40 62 L39 58 Z" fill="#D64545" stroke={line} strokeWidth="1" />
        )}

        {/* Bavette technicien (Outils/Paramètres) */}
        {outfit === 'technician' && (
          <rect x="30" y="48" width="20" height="12" rx="3" fill={isDark ? '#334155' : '#475569'} stroke={line} strokeWidth="1.5" />
        )}

        {/* Bloc-notes (Planning) */}
        {outfit === 'notepad' && (
          <rect x="46" y="50" width="10" height="13" rx="1.5" fill="#F8FAFC" stroke={line} strokeWidth="1.5" />
        )}

        {/* Bras animé (droit) */}
        <motion.g style={{ transformOrigin: '54px 46px' }} animate={anim} transition={pose === 'wave' ? { duration: 1.3, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}>
          <path d="M54 46 Q64 40 66 30" stroke={skin} strokeWidth="9" strokeLinecap="round" fill="none" />
        </motion.g>

        {/* Bras gauche fixe */}
        <path d="M28 46 Q20 52 18 62" stroke={skin} strokeWidth="9" strokeLinecap="round" fill="none" />

        {/* Cou */}
        <rect x="35" y="30" width="10" height="10" fill={skin} />

        {/* Tête (grande, style webtoon) */}
        <circle cx="40" cy="22" r="17" fill={skin} stroke={line} strokeWidth="2" />

        {/* Cheveux stylisés */}
        <path d="M23 20 Q22 2 40 3 Q58 2 57 20 Q54 8 40 8 Q26 8 23 20Z" fill={hair} stroke={line} strokeWidth="1.5" />

        {/* Lunettes (Études) */}
        {outfit === 'backpack' ? (
          <>
            <circle cx="34" cy="23" r="5" fill="white" fillOpacity="0.15" stroke={line} strokeWidth="1.6" />
            <circle cx="46" cy="23" r="5" fill="white" fillOpacity="0.15" stroke={line} strokeWidth="1.6" />
            <line x1="39" y1="23" x2="41" y2="23" stroke={line} strokeWidth="1.6" />
          </>
        ) : (
          <>
            {/* Grands yeux expressifs webtoon */}
            <ellipse cx="34" cy="23" rx="2.6" ry="3.4" fill="#1e1b16" />
            <ellipse cx="46" cy="23" rx="2.6" ry="3.4" fill="#1e1b16" />
            <circle cx="35" cy="21.5" r="0.9" fill="white" />
            <circle cx="47" cy="21.5" r="0.9" fill="white" />
          </>
        )}

        {/* Sourire simple */}
        <path d="M35 29 Q40 32 45 29" stroke={line} strokeWidth="1.6" fill="none" strokeLinecap="round" />

        {/* Joues (petite touche webtoon) */}
        <circle cx="29" cy="26" r="2.2" fill="#FF9E9E" opacity="0.35" />
        <circle cx="51" cy="26" r="2.2" fill="#FF9E9E" opacity="0.35" />
      </svg>

      <div
        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-base-950"
        style={{ backgroundColor: outfitColor }}
      >
        <Accessory className="w-3.5 h-3.5 text-white" />
      </div>
    </div>
  );
}
