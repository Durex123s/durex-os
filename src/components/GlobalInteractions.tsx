import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export function GlobalInteractions() {
  useEffect(() => {
    const isNative = Capacitor.isNativePlatform();

    function handlePointerDown(e: PointerEvent) {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        'button, a[href], [role="button"], .ripple-target'
      );
      if (!target || target.hasAttribute('data-no-ripple')) return;

      if (isNative) {
        Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
      }

      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.6;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      target.classList.add('ripple-host');
      target.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
      setTimeout(() => ripple.remove(), 700);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return null;
}
