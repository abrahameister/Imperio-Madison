import { useState, useEffect } from 'react';

/**
 * Returns `true` once the window has scrolled past `threshold` pixels.
 * Used to trigger the header glassmorphism + height-shrink effect.
 */
export function useScrollShrink(threshold: number = 20): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return isScrolled;
}
