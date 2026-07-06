/**
 * analytics/pageView.ts
 *
 * Page view tracking for SPA navigation.
 *
 * Since XLChess is a single-page application with hash-based scrolling
 * (not React Router), page views are tracked at mount and on hashchange.
 *
 * Duplicate prevention: tracks lastTrackedPath to avoid firing the same
 * path twice in a row (handles React StrictMode double-mount).
 */

import { trackEvent } from './events';

let lastTrackedPath = '';

/**
 * Track a page view. Prevents duplicate fires for the same path.
 */
export function trackPageView(
  path: string = typeof window !== 'undefined' ? window.location.href : '/',
  title: string = typeof document !== 'undefined' ? document.title : '',
  referrer: string = typeof document !== 'undefined' ? document.referrer : ''
): void {
  if (typeof window === 'undefined') return;

  // Deduplicate
  if (path === lastTrackedPath) return;
  lastTrackedPath = path;

  trackEvent({
    event: 'page_view',
    page_path: path,
    page_title: title,
    referrer: referrer,
  });
}

/**
 * Set up SPA hash-change page view tracking.
 * Call once at app root.
 * Returns cleanup function.
 */
export function setupPageViewTracking(): () => void {
  if (typeof window === 'undefined') return () => {};

  // Fire initial page view
  trackPageView();

  // Track hash changes (for anchor navigation)
  const handleHashChange = () => {
    trackPageView(window.location.href, document.title, document.referrer);
  };

  window.addEventListener('hashchange', handleHashChange);

  return () => {
    window.removeEventListener('hashchange', handleHashChange);
  };
}
