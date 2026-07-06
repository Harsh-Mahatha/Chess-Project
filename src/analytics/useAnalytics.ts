/**
 * analytics/useAnalytics.ts
 *
 * Global session & lifecycle analytics hook.
 * Call once inside App.tsx.
 *
 * Fires:
 *   - session_started  (once per browser session, via sessionStorage guard)
 *   - page_loaded      (once on mount)
 *   - first_interaction (on first click/keydown/touch, then removes itself)
 *
 * Also sets up page view tracking (hashchange support).
 */

import { useEffect, useRef } from 'react';
import { trackEvent } from './events';
import { setupPageViewTracking } from './pageView';

const SESSION_KEY = '__xlchess_session_started';

export function useAnalytics(): void {
  const firstInteractionFiredRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // ── Page loaded ──────────────────────────────────────────────────────
    trackEvent({
      event:      'page_loaded',
      page_title: document.title,
    });

    // ── Session started (once per browser session) ────────────────────────
    if (!sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.setItem(SESSION_KEY, '1');
      trackEvent({
        event:    'session_started',
        referrer: document.referrer,
      });
    }

    // ── First interaction ─────────────────────────────────────────────────
    const handleFirstInteraction = (type: 'click' | 'keydown' | 'touch') => {
      if (firstInteractionFiredRef.current) return;
      firstInteractionFiredRef.current = true;

      trackEvent({
        event:            'first_interaction',
        interaction_type: type,
      });

      // Remove all listeners after first fire
      document.removeEventListener('click',    onFirstClick);
      document.removeEventListener('keydown',  onFirstKeydown);
      document.removeEventListener('touchstart', onFirstTouch);
    };

    const onFirstClick   = () => handleFirstInteraction('click');
    const onFirstKeydown = () => handleFirstInteraction('keydown');
    const onFirstTouch   = () => handleFirstInteraction('touch');

    document.addEventListener('click',     onFirstClick,   { once: true, passive: true });
    document.addEventListener('keydown',   onFirstKeydown, { once: true, passive: true });
    document.addEventListener('touchstart',onFirstTouch,   { once: true, passive: true });

    // ── Page view tracking (initial + hashchange) ─────────────────────────
    const cleanupPageView = setupPageViewTracking();

    return () => {
      document.removeEventListener('click',     onFirstClick);
      document.removeEventListener('keydown',   onFirstKeydown);
      document.removeEventListener('touchstart', onFirstTouch);
      cleanupPageView();
    };
  }, []);
}
