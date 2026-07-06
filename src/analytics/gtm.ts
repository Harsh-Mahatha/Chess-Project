/**
 * analytics/gtm.ts
 *
 * Google Tag Manager initialization.
 *
 * Rules:
 *  - Initializes ONLY once (duplicate guard via window.__gtm_initialized)
 *  - SSR-safe (window check before any access)
 *  - Reads GTM Container ID from import.meta.env (never hardcoded)
 *  - Injects the GTM script asynchronously (non-blocking)
 *  - Returns helpers: isInitialized(), getDataLayer()
 *
 * To add future pixels (Meta, LinkedIn, Hotjar, etc.) create a new
 * initXxx() function in this file and call it from main.tsx alongside initGTM().
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    /** Internal guard — prevents double initialization */
    __gtm_initialized?: boolean;
  }
}

/**
 * Initialize Google Tag Manager.
 * Call once at application root (main.tsx) before ReactDOM.render().
 */
export function initGTM(): void {
  // SSR guard
  if (typeof window === 'undefined') return;

  // Duplicate guard
  if (window.__gtm_initialized) return;

  const containerId = import.meta.env.VITE_GTM_CONTAINER_ID as string | undefined;

  if (!containerId) {
    if (import.meta.env.DEV) {
      console.warn(
        '[Analytics] GTM Container ID not set.\n' +
        'Add VITE_GTM_CONTAINER_ID=GTM-XXXXXXX to your .env file.'
      );
    }
    // Still initialize dataLayer so trackEvent() works without GTM
    window.dataLayer = window.dataLayer || [];
    window.__gtm_initialized = true;
    return;
  }

  // Initialize dataLayer before GTM script loads
  window.dataLayer = window.dataLayer || [];

  // Push initial GTM configuration event
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  // Inject GTM script asynchronously (non-blocking)
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;
  script.id = 'gtm-script';

  const firstScript = document.getElementsByTagName('script')[0];
  firstScript?.parentNode?.insertBefore(script, firstScript);

  window.__gtm_initialized = true;

  if (import.meta.env.DEV) {
    console.info(
      `%c[Analytics] GTM initialized%c — Container: ${containerId}`,
      'color: #D4AF6E; font-weight: bold;',
      'color: inherit;'
    );
  }
}

/**
 * Returns true if GTM has been initialized.
 * Useful for conditional logic in edge cases.
 */
export function isGTMInitialized(): boolean {
  if (typeof window === 'undefined') return false;
  return !!window.__gtm_initialized;
}

/**
 * Safe accessor for window.dataLayer.
 * Returns an empty array if dataLayer is unavailable.
 */
export function getDataLayer(): Record<string, unknown>[] {
  if (typeof window === 'undefined') return [];
  return window.dataLayer || [];
}
