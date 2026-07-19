import { useEffect, useRef, useState } from 'react';

// easeOutExpo — départ rapide, ralentit en douceur vers la valeur finale.
function ease(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/** Anime une valeur numérique vers sa cible. Utilisable partout (HTML, SVG). */
export function useAnimatedNumber(value: number, duration = 700): number {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;

    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const current = from + (to - from) * ease(progress);
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return Math.round(display);
}

interface AnimatedNumberProps {
  value: number;
  /** Formatte la valeur affichée à chaque frame (ex: ajouter "FCFA", arrondir). */
  format?: (n: number) => string;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({ value, format, duration = 700, className }: AnimatedNumberProps) {
  const rounded = useAnimatedNumber(value, duration);
  return <span className={className}>{format ? format(rounded) : rounded.toLocaleString('fr-FR')}</span>;
}
