import React, { useCallback, useRef } from 'react';

interface Tilt3DProps {
  children: React.ReactNode;
  /** Max rotation on each axis, in degrees. */
  max?: number;
  /** Z-translation applied to `.tilt-layer` descendants. */
  depth?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
  ariaLabel?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

const supportsHover = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Z-axis card physics. Pointer position drives rotateX/rotateY on the body and
 * feeds --px/--py to the card sheen. Writes are batched into a rAF frame and
 * touch only `transform`, so nothing reflows.
 */
export const Tilt3D: React.FC<Tilt3DProps> = ({
  children,
  max = 7,
  depth = 26,
  className = '',
  style,
  onClick,
  role,
  tabIndex,
  ariaLabel,
  onKeyDown
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const pending = useRef<{ rx: number; ry: number; px: number; py: number } | null>(null);

  const flush = useCallback(() => {
    frame.current = null;
    const body = bodyRef.current;
    const next = pending.current;
    if (!body || !next) return;
    body.style.setProperty('--rx', `${next.rx.toFixed(2)}deg`);
    body.style.setProperty('--ry', `${next.ry.toFixed(2)}deg`);
    body.style.setProperty('--px', `${next.px.toFixed(1)}%`);
    body.style.setProperty('--py', `${next.py.toFixed(1)}%`);
  }, []);

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!supportsHover()) return;
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;

      pending.current = {
        rx: (0.5 - ny) * max * 2,
        ry: (nx - 0.5) * max * 2,
        px: nx * 100,
        py: ny * 100
      };

      if (frame.current === null) frame.current = requestAnimationFrame(flush);
    },
    [flush, max]
  );

  const handleLeave = useCallback(() => {
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    const body = bodyRef.current;
    if (!body) return;
    body.style.setProperty('--rx', '0deg');
    body.style.setProperty('--ry', '0deg');
  }, []);

  return (
    <div
      ref={stageRef}
      className={`tilt-stage ${className}`.trim()}
      style={style}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
    >
      <div ref={bodyRef} className="tilt-body" style={{ ['--depth' as string]: `${depth}px` }}>
        {children}
      </div>
    </div>
  );
};
