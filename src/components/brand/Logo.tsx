import React from 'react';

/**
 * ASCEND LABORATORIES brand mark.
 *
 * Anatomy (per brand spec):
 *  - Vibrant Red (#F23D26) curved brush stroke arcing above the wordmark
 *  - Navy Blue (#06028A) "ASCEND" lettering
 *  - Navy Blue horizontal separator rule
 *  - Navy Blue "Laboratories, LLC" sub-text
 *
 * `tone="light"` renders the mark for navy grounds (white lettering, red stroke kept).
 */

interface BrushStrokeProps {
  width?: number;
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** The tapered red brush arc, drawn as a filled crescent so the ends feather. */
export const BrushStroke: React.FC<BrushStrokeProps> = ({
  width = 120,
  animate = false,
  className,
  style
}) => (
  <svg
    width={width}
    height={width * 0.19}
    viewBox="0 0 120 23"
    fill="none"
    aria-hidden="true"
    className={className}
    style={{
      overflow: 'visible',
      ...(animate
        ? {
            clipPath: 'inset(0 100% 0 0)',
            animation: 'brushSweep 1100ms cubic-bezier(0.16,1,0.3,1) 240ms forwards'
          }
        : null),
      ...style
    }}
  >
    <path
      d="M1.6 20.4C22 5.4 54 -1.2 84.6 3.2c12.4 1.8 23.2 5.6 33.8 11.6-10.4-4-21-6.6-32-7.8C55 3.6 25.4 10.6 5.4 23.4c-1.6 1-3.2-1.6-3.8-3Z"
      fill="#F23D26"
    />
  </svg>
);

interface LogoProps {
  /** Wordmark cap-height driver, in px. */
  size?: number;
  tone?: 'dark' | 'light';
  /** Show the "Laboratories, LLC" sub-lockup below the separator rule. */
  showSubtext?: boolean;
  animateBrush?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 26,
  tone = 'dark',
  showSubtext = true,
  animateBrush = false,
  className
}) => {
  const wordColor = tone === 'light' ? '#ffffff' : '#06028A';
  const ruleColor = tone === 'light' ? 'rgba(255,255,255,0.55)' : '#06028A';
  const subColor = tone === 'light' ? 'rgba(255,255,255,0.82)' : '#06028A';
  const brushWidth = size * 4.1;

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: 1,
        userSelect: 'none'
      }}
    >
      {/* Vibrant red brush stroke */}
      <BrushStroke
        width={brushWidth}
        animate={animateBrush}
        style={{ marginBottom: size * -0.06, marginLeft: size * 0.06 }}
      />

      {/* ASCEND wordmark */}
      <span
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: `${size}px`,
          fontWeight: 800,
          letterSpacing: '0.11em',
          color: wordColor,
          lineHeight: 1,
          paddingLeft: '0.11em'
        }}
      >
        ASCEND
      </span>

      {showSubtext && (
        <>
          {/* Navy separator rule */}
          <span
            aria-hidden="true"
            style={{
              display: 'block',
              width: '100%',
              height: Math.max(1, Math.round(size * 0.055)),
              backgroundColor: ruleColor,
              marginTop: size * 0.2,
              marginBottom: size * 0.16,
              borderRadius: 2
            }}
          />
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: `${Math.max(7, size * 0.295)}px`,
              fontWeight: 600,
              letterSpacing: '0.13em',
              color: subColor,
              lineHeight: 1,
              whiteSpace: 'nowrap'
            }}
          >
            Laboratories, LLC
          </span>
        </>
      )}
    </span>
  );
};

/** Compact square glyph for favicons, avatars and tight nav slots. */
export const LogoGlyph: React.FC<{ size?: number; tone?: 'dark' | 'light' }> = ({
  size = 42,
  tone = 'dark'
}) => (
  <span
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.3,
      background: tone === 'light' ? 'rgba(255,255,255,0.12)' : '#06028A',
      border: tone === 'light' ? '1px solid rgba(255,255,255,0.22)' : '1px solid rgba(255,255,255,0.16)',
      boxShadow:
        tone === 'light'
          ? 'inset 0 1px 0 rgba(255,255,255,0.24)'
          : '0 10px 24px -10px rgba(6,2,138,0.6), inset 0 1px 0 rgba(255,255,255,0.22)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }}
  >
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 8.5C8.2 4.4 15.8 4.4 20 7.6" stroke="#F23D26" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M4.4 20.5L12 10.2L19.6 20.5H15.9L12 15.2L8.1 20.5H4.4Z" fill="#ffffff" />
    </svg>
  </span>
);
