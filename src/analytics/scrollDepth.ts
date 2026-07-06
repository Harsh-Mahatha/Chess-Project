/**
 * analytics/scrollDepth.ts
 *
 * Intelligent scroll depth tracking.
 *
 * - Fires events at 25%, 50%, 75%, and 100% scroll depth
 * - Each milestone fires exactly once per page load
 * - Throttled to one animation frame (~16ms) to avoid excessive firing
 * - Detects the currently visible section via IntersectionObserver
 * - Returned hook is SSR-safe and cleans up listeners on unmount
 *
 * Usage (in App.tsx):
 *   import { useScrollDepth } from './analytics';
 *   // In component body:
 *   useScrollDepth();
 */

import { useEffect, useRef } from 'react';
import { trackEvent } from './events';

const MILESTONES = [25, 50, 75, 100] as const;
type Milestone = typeof MILESTONES[number];

/**
 * Returns the ID of the most prominently visible section on screen.
 * Falls back to window.location.pathname if no section is detected.
 */
function getVisibleSection(): string {
  if (typeof document === 'undefined') return '/';

  const sectionIds = [
    'hero-section',
    'why-ownership',
    'how-it-works',
    'interactive-demo',
    'partner-cta',
  ];

  let bestSection = '';
  let bestVisibility = 0;

  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (!el) continue;

    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // How much of the section is visible?
    const visibleTop    = Math.max(0, rect.top);
    const visibleBottom = Math.min(windowHeight, rect.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);

    if (visibleHeight > bestVisibility) {
      bestVisibility = visibleHeight;
      bestSection = id;
    }
  }

  return bestSection || window.location.pathname;
}

/**
 * React hook — attaches a throttled scroll listener that tracks depth milestones.
 * Safe to call in strict mode (listener deduped by cleanup).
 */
export function useScrollDepth(): void {
  const firedRef = useRef<Set<Milestone>>(new Set());
  const rafRef   = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      // Throttle using requestAnimationFrame
      if (rafRef.current !== null) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;

        const scrollTop    = window.scrollY || document.documentElement.scrollTop;
        const docHeight    = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollable   = docHeight - windowHeight;

        if (scrollable <= 0) return;

        const scrollPercent = (scrollTop / scrollable) * 100;

        for (const milestone of MILESTONES) {
          if (!firedRef.current.has(milestone) && scrollPercent >= milestone) {
            firedRef.current.add(milestone);

            trackEvent({
              event:             'scroll_depth',
              scroll_percentage: milestone,
              section:           getVisibleSection(),
              page:              window.location.pathname,
            });
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);
}
