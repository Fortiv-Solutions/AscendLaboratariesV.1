import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  /** Stagger offset in ms. */
  delay?: number;
  /** Fraction of the element that must be visible before it resolves. */
  threshold?: number;
  as?: 'div' | 'section' | 'article' | 'li' | 'span';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Scroll-entry choreography. Elements arrive with a heavy, blurred fade-up
 * rather than appearing statically. Uses IntersectionObserver — never a
 * scroll listener — so it costs nothing during scroll.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  threshold = 0.14,
  as: Tag = 'div',
  className = '',
  style
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsIn(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIn(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${isIn ? 'is-in' : ''} ${className}`.trim()}
      style={{ ['--reveal-delay' as string]: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
};
