import React, { useEffect, useRef } from 'react';
import type { VoiceActivity, VoiceLevels, VoicePhase } from '../../hooks/useRealtimeVoice';

/**
 * The Ascend monogram, animated as a voice.
 * The brand's red arc above the "A" carries the assistant's voice and radiates
 * echo arcs upward; the caller's voice ripples beneath the tile in soft lavender.
 */

interface VoiceEmblemProps {
  phase: VoicePhase;
  activity: VoiceActivity;
  getLevels: () => VoiceLevels;
  size?: number;
  compact?: boolean;
}

interface Ripple {
  radius: number;
  life: number;
  weight: number;
  up: boolean;
}

const RED = '242, 61, 38';
const LAVENDER = '196, 202, 255';
const NAVY = '#06028A';
const MONOGRAM_A = new Path2D('M8 25L16 12L24 25H20L16 18.5L12 25H8Z');
const MONOGRAM_ARC = new Path2D('M6 10.5C10 6.5 22 6.5 26 10');

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export const VoiceEmblem: React.FC<VoiceEmblemProps> = ({ phase, activity, getLevels, size = 200, compact = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ phase, activity, getLevels });
  stateRef.current = { phase, activity, getLevels };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const c = size / 2;
    const tile = size * (compact ? 0.5 : 0.34);
    const baseRadius = tile * 0.82;
    const maxRadius = size * 0.48;

    const ripples: Ripple[] = [];
    let raf = 0;
    let last = performance.now();
    let outLevel = 0;
    let inLevel = 0;
    let spin = 0;
    let breath = 0;
    let outCharge = 0;
    let inCharge = 0;

    const drawArc = (radius: number, sweep: number, width: number, color: string, up: boolean, offset = 0) => {
      const center = (up ? -Math.PI / 2 : Math.PI / 2) + offset;
      ctx.beginPath();
      ctx.arc(c, c, radius, center - sweep / 2, center + sweep / 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.stroke();
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { phase: ph, activity: act, getLevels: levels } = stateRef.current;
      const live = ph === 'live';
      const { input, output } = live ? levels() : { input: 0, output: 0 };

      // Fast attack, slow release keeps the motion organic rather than jittery
      outLevel += (output - outLevel) * (output > outLevel ? 0.5 : 0.12);
      inLevel += (input - inLevel) * (input > inLevel ? 0.5 : 0.12);
      breath += dt * (ph === 'connecting' ? 3.2 : 1.1);
      spin += dt * (act === 'working' ? 3.4 : 2.2);

      ctx.clearRect(0, 0, size, size);

      // Halo
      const glowStrength = ph === 'error' ? 0.18 : 0.42 + outLevel * 0.4;
      const halo = ctx.createRadialGradient(c, c, tile * 0.2, c, c, maxRadius);
      halo.addColorStop(0, `rgba(40, 34, 220, ${glowStrength})`);
      halo.addColorStop(0.55, 'rgba(11, 6, 184, 0.12)');
      halo.addColorStop(1, 'rgba(11, 6, 184, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, size, size);

      // Echo arcs
      if (!reduceMotion && live) {
        outCharge += outLevel * dt * 9;
        inCharge += inLevel * dt * 9;
        if (outCharge > 1 && outLevel > 0.08) {
          ripples.push({ radius: baseRadius, life: 1, weight: 0.6 + outLevel, up: true });
          outCharge = 0;
        }
        if (inCharge > 1 && inLevel > 0.08) {
          ripples.push({ radius: baseRadius, life: 1, weight: 0.6 + inLevel, up: false });
          inCharge = 0;
        }
        if (ripples.length > 10) ripples.splice(0, ripples.length - 10);
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += dt * (maxRadius - baseRadius) * 0.9;
        r.life = 1 - (r.radius - baseRadius) / (maxRadius - baseRadius);
        if (r.life <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        const sweep = (r.up ? 1.25 : 1.05) - (1 - r.life) * 0.35;
        const color = r.up ? `rgba(${RED}, ${r.life * 0.7})` : `rgba(${LAVENDER}, ${r.life * 0.55})`;
        drawArc(r.radius, sweep, Math.max(0.8, 2.4 * r.weight * r.life), color, r.up);
      }

      // Primary voice arc
      if (ph === 'connecting' || (live && (act === 'thinking' || act === 'working'))) {
        const pulse = reduceMotion ? 0.6 : 0.5 + Math.sin(breath) * 0.2;
        drawArc(baseRadius, Math.PI * 2, 1, `rgba(${LAVENDER}, 0.14)`, true);
        drawArc(baseRadius, 0.9, 3, `rgba(${RED}, ${0.65 + pulse * 0.35})`, true, reduceMotion ? 0 : spin);
      } else {
        const idleBreath = reduceMotion ? 0 : Math.sin(breath) * 0.06;
        const sweep = 1.05 + idleBreath + outLevel * 1.15;
        const alpha = ph === 'error' ? 0.35 : 0.85;
        drawArc(baseRadius, sweep, 3 + outLevel * 4, `rgba(${RED}, ${alpha})`, true);
        if (live && act === 'hearing') {
          drawArc(baseRadius, 0.9 + inLevel * 1.1, 2 + inLevel * 3, `rgba(${LAVENDER}, 0.7)`, false);
        }
      }

      // Monogram tile
      const lift = reduceMotion ? 0 : Math.sin(breath * 0.9) * (compact ? 0 : 1.2);
      const x = c - tile / 2;
      const y = c - tile / 2 + lift;
      ctx.save();
      ctx.shadowColor = 'rgba(3, 1, 32, 0.55)';
      ctx.shadowBlur = tile * 0.35;
      ctx.shadowOffsetY = tile * 0.1;
      roundedRect(ctx, x, y, tile, tile, tile * 0.26);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(tile / 32, tile / 32);
      ctx.fillStyle = NAVY;
      ctx.fill(MONOGRAM_A);
      ctx.strokeStyle = '#F23D26';
      ctx.lineWidth = 2.8;
      ctx.lineCap = 'round';
      ctx.stroke(MONOGRAM_ARC);
      ctx.restore();

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [size, compact]);

  return (
    <canvas
      ref={canvasRef}
      className="ascend-voice-emblem-canvas"
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
};
