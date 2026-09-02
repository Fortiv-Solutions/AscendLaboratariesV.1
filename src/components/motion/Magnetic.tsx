import React, { useCallback, useRef } from 'react';

interface MagneticProps {
  children: React.ReactNode;
  /** Peak pull distance in px. */
  strength?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Magnetic pull. The wrapped control drifts toward the cursor as it approaches
 * and springs back on exit. Pure `transform`, rAF-batched.
 */
export const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 9,
  className = '',
  style
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef<number | null>(null);
  const pending = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const flush = useCallback(() => {
    frame.current = null;
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--mx', `${pending.current.x.toFixed(2)}px`);
    el.style.setProperty('--my', `${pending.current.y.toFixed(2)}px`);
  }, []);

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLSpanElement>) => {
      if (
        typeof window === 'undefined' ||
        !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return;
      }
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      pending.current = {
        x: ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * strength,
        y: ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * strength * 0.6
      };
      if (frame.current === null) frame.current = requestAnimationFrame(flush);
    },
    [flush, strength]
  );

  const handleLeave = useCallback(() => {
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--mx', '0px');
    el.style.setProperty('--my', '0px');
  }, []);

  return (
    <span
      ref={ref}
      className={`magnetic ${className}`.trim()}
      style={style}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </span>
  );
};
