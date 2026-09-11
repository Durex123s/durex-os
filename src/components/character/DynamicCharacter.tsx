import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useReducedMotion } from 'framer-motion';
import { CHARACTER_IMAGE, type CharacterState } from '@/character/states';
import { useCharacter, useCharacterState } from '@/store/useCharacter';

interface DynamicCharacterProps {
  state?: CharacterState;
  size?: number;
  className?: string;
  interactive?: boolean;
}

const CELEBRATE_STATES = new Set<CharacterState>([
  'success', 'achievement', 'big_success', 'joy', 'excitement', 'encouragement', 'connection',
]);
const ALERT_STATES = new Set<CharacterState>(['error', 'disconnection', 'anger']);

// Personnage Veyrion : image selon l'état global (ou figée via la prop
// `state`), avec une animation "vivante" en continu (respiration/flottement),
// une choréographie de réaction par catégorie d'état, et des interactions
// tactiles (tap, double-tap, appui long). Respecte prefers-reduced-motion.
export function DynamicCharacter({ state, size = 64, className, interactive = true }: DynamicCharacterProps) {
  const globalState = useCharacterState();
  const react = useCharacter((s) => s.react);
  const active = state ?? globalState;
  const reducedMotion = useReducedMotion();

  const [visible, setVisible] = useState(true);
  const [src, setSrc] = useState(CHARACTER_IMAGE[active]);
  const controls = useAnimation();
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTap = useRef(0);

  const startIdleLoop = () => {
    if (reducedMotion) {
      controls.set({ y: 0, rotate: 0, scale: 1, x: 0 });
      return;
    }
    controls.start({
      y: [0, -2, 0],
      rotate: [0, -1.5, 0, 1.5, 0],
      scale: [1, 1.015, 1],
      transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
    });
  };

  // Fondu de l'image quand l'état affiché change.
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => {
      setSrc(CHARACTER_IMAGE[active]);
      setVisible(true);
    }, 150);
    return () => clearTimeout(t);
  }, [active]);

  // Choréographie ponctuelle selon la catégorie de l'état, puis retour au
  // flottement par défaut.
  useEffect(() => {
    if (reducedMotion) return;
    let cancelled = false;
    (async () => {
      if (CELEBRATE_STATES.has(active)) {
        await controls.start({ y: [0, -6, 0], scale: [1, 1.08, 1], transition: { duration: 0.6, ease: 'easeOut' } });
      } else if (ALERT_STATES.has(active)) {
        await controls.start({ x: [0, -4, 4, -3, 3, 0], transition: { duration: 0.45, ease: 'easeInOut' } });
      } else if (active === 'thinking' || active === 'doubt') {
        await controls.start({ rotate: [0, -6, -4], transition: { duration: 0.4 } });
      } else if (active === 'sadness') {
        await controls.start({ y: [0, 3], rotate: [0, 3], transition: { duration: 0.5 } });
      }
      if (!cancelled) startIdleLoop();
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reducedMotion]);

  useEffect(() => {
    startIdleLoop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTap = () => {
    if (!interactive) return;
    const now = Date.now();
    if (now - lastTap.current < 320) {
      react('veyrion', { duration: 2200 });
    } else {
      react('joy', { duration: 1300 });
    }
    lastTap.current = now;
  };

  const handlePressStart = () => {
    if (!interactive) return;
    pressTimer.current = setTimeout(() => react('excitement', { duration: 1500 }), 550);
  };
  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  return (
    <motion.div
      className={className}
      style={{ width: size, height: size, display: 'inline-block', cursor: interactive ? 'pointer' : undefined, touchAction: 'manipulation' }}
      animate={controls}
      whileHover={interactive && !reducedMotion ? { scale: 1.04 } : undefined}
      whileTap={interactive && !reducedMotion ? { scale: 0.96 } : undefined}
      onClick={handleTap}
      onPointerDown={handlePressStart}
      onPointerUp={handlePressEnd}
      onPointerLeave={handlePressEnd}
    >
      <img
        src={src}
        alt="Veyrion"
        width={size}
        height={size}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '9999px',
          objectFit: 'cover',
          opacity: visible ? 1 : 0,
          transition: 'opacity 200ms ease',
          boxShadow: CELEBRATE_STATES.has(active) ? '0 0 16px 2px rgb(var(--color-accent) / 0.45)' : 'none',
        }}
      />
    </motion.div>
  );
}
