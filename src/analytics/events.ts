/**
 * analytics/events.ts
 *
 * Core trackEvent() function — the single public API for all analytics.
 *
 * Usage:
 *   import { trackEvent } from '../analytics';
 *
 *   trackEvent({
 *     event: 'hero_cta_click',
 *     button_name: 'play',
 *     destination: '#interactive-demo',
 *   });
 *
 * Guarantees:
 *   - Never throws (all errors caught)
 *   - Validates event name (warns if missing)
 *   - Auto-enriches every event with: timestamp, page, device_type, viewport
 *   - Logs to console only in development (formatted, easy to read)
 *   - Pushes to window.dataLayer (GTM picks up from there)
 *   - Works even if GTM is not loaded (dataLayer still populated)
 */

import type { TrackEventPayload, AutoMetadata, DeviceType } from './types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function getViewport(): string {
  if (typeof window === 'undefined') return '0x0';
  return `${window.innerWidth}x${window.innerHeight}`;
}

function getPage(): string {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname + window.location.search;
}

function buildAutoMetadata(): AutoMetadata {
  return {
    timestamp:   new Date().toISOString(),
    page:        getPage(),
    device_type: getDeviceType(),
    viewport:    getViewport(),
  };
}

// ── Dev logging ───────────────────────────────────────────────────────────────

const IS_DEV = import.meta.env.DEV;

function logEvent(eventName: string, payload: Record<string, unknown>): void {
  if (!IS_DEV) return;

  console.groupCollapsed(
    `%c[Analytics]%c Event: %c${eventName}`,
    'color: #D4AF6E; font-weight: bold;',
    'color: inherit; font-weight: normal;',
    'color: #A3E635; font-weight: bold;'
  );
  console.log('Payload:', payload);
  console.groupEnd();
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Track any analytics event.
 * Automatically enriches with metadata. Safe to call anywhere.
 */
export function trackEvent(payload: TrackEventPayload): void {
  // SSR guard
  if (typeof window === 'undefined') return;

  try {
    // Validate event name
    if (!payload.event) {
      if (IS_DEV) {
        console.warn('[Analytics] trackEvent() called without an event name. Skipping.');
      }
      return;
    }

    // Build full event object
    const meta = buildAutoMetadata();
    const fullPayload: Record<string, unknown> = {
      ...meta,
      ...payload,
    };

    // Ensure dataLayer exists (defensive)
    window.dataLayer = window.dataLayer || [];

    // Push to GTM dataLayer
    window.dataLayer.push(fullPayload);

    // Dev logging
    logEvent(payload.event, fullPayload);

  } catch (err) {
    // Analytics should never crash the app
    if (IS_DEV) {
      console.error('[Analytics] trackEvent() threw an error:', err);
    }
  }
}
