/**
 * useConfetti.ts
 *
 * Confetti state management hook.
 * Integrates with @tsparticles/react and @tsparticles/preset-confetti-cannon.
 */

import { useState, useCallback } from 'react';
import { prefersReducedMotion } from '../utils/gsapConfig';

export function useConfetti() {
  const [showConfetti, setShowConfetti] = useState(false);

  const triggerConfetti = useCallback(() => {
    if (prefersReducedMotion()) return;
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 2500); // 2.5 seconds is enough for the 2-second confetti burst and fade-out
  }, []);

  return { showConfetti, triggerConfetti };
}
