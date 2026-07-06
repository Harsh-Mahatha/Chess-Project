# XLChess Analytics Guide

## Architecture Overview

```
src/analytics/
├── index.ts        ← Public API (always import from here)
├── types.ts        ← TypeScript interfaces for every event
├── constants.ts    ← EVENTS, SECTIONS, FORMS, PUZZLES constants
├── gtm.ts          ← GTM initialization (called once in main.tsx)
├── events.ts       ← trackEvent() core function
├── pageView.ts     ← SPA page view tracking
├── scrollDepth.ts  ← useScrollDepth() hook
└── useAnalytics.ts ← useAnalytics() global lifecycle hook
```

All events flow through `trackEvent()` → `window.dataLayer` → GTM → GA4.

**Components never touch `window.dataLayer` directly.**

---

## Quick Start

```tsx
import { trackEvent, EVENTS } from '../analytics';

// In any component:
trackEvent({
  event: EVENTS.HERO_CTA_CLICK,
  button_name: 'play',
  destination: '#interactive-demo',
});
```

---

## How to Add a New Event

### Step 1 — Add the event name to `constants.ts`

```ts
export const EVENTS = {
  // ... existing events
  MY_NEW_EVENT: 'my_new_event',
} as const;
```

### Step 2 — Add a TypeScript interface to `types.ts`

```ts
export interface MyNewEventPayload {
  event: 'my_new_event';
  my_param: string;
  another_param?: number;
}
```

### Step 3 — Add to the master union in `types.ts`

```ts
export type TrackEventPayload =
  | ... existing types ...
  | MyNewEventPayload;
```

### Step 4 — Export from `index.ts` (if consumers need the type)

```ts
export type { MyNewEventPayload } from './types';
```

### Step 5 — Call in your component

```tsx
import { trackEvent, EVENTS } from '../analytics';

trackEvent({
  event: EVENTS.MY_NEW_EVENT,
  my_param: 'value',
});
```

TypeScript will enforce the payload shape automatically.

---

## Environment Variables

```env
VITE_GTM_CONTAINER_ID=GTM-XXXXXXX
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

These are in `.env`. Never commit real IDs to public repos — add `.env` to `.gitignore` or use `.env.local`.

---

## GTM Initialization

`initGTM()` is called in `main.tsx` before `ReactDOM.createRoot()`:

```tsx
import { initGTM } from './analytics';
initGTM(); // ← called once, before render
```

**What it does:**
1. Checks `window.__gtm_initialized` (prevents duplicate init)
2. Creates `window.dataLayer = []`
3. Pushes `gtm.js` start event
4. Injects `<script async src="...gtm.js?id=GTM-XXXXX">` non-blocking
5. Sets `window.__gtm_initialized = true`

If `VITE_GTM_CONTAINER_ID` is missing, it logs a warning in dev mode but still initializes `dataLayer` so `trackEvent()` works.

---

## Debug Mode (Development)

In development, every `trackEvent()` call logs to the browser console:

```
▶ [Analytics] Event: hero_cta_click
  Payload: {
    event: "hero_cta_click",
    button_name: "play",
    destination: "#interactive-demo",
    timestamp: "2026-07-07T...",
    page: "/",
    device_type: "desktop",
    viewport: "1440x900"
  }
```

Debug logs are completely disabled in production (`import.meta.env.DEV = false`).

---

## GTM Preview Mode

1. Go to [tagmanager.google.com](https://tagmanager.google.com)
2. Open your container → Click **Preview**
3. Enter your site URL
4. GTM Tag Assistant will open alongside your site
5. Every `dataLayer.push()` appears in the **Data Layer** tab in real time

---

## GA4 DebugView

1. Install **Google Analytics Debugger** Chrome extension (or use `?gtm_debug=x` URL param)
2. Go to GA4 → Reports → **DebugView**
3. Events appear in real-time as you interact with the site
4. Use this to verify event parameters and naming

---

## Adding Future Marketing Pixels

The architecture is designed to accommodate additional pixels **without modifying `trackEvent()`**.

### Option A — GTM Tags (Recommended)
Configure Meta Pixel, LinkedIn Insight, Hotjar, etc. as **GTM tags** triggered by custom events. No code changes needed — just add tags in the GTM UI.

### Option B — Direct initialization
Create a new file in `src/analytics/`:

```ts
// src/analytics/metaPixel.ts
export function initMetaPixel(): void {
  if (typeof window === 'undefined') return;
  const pixelId = import.meta.env.VITE_META_PIXEL_ID;
  if (!pixelId) return;
  // ... inject fbq script
}
```

Call it in `main.tsx` alongside `initGTM()`.

### Option C — Middleware in `events.ts`
For pixels that need direct event calls alongside GTM:

```ts
// In trackEvent(), after window.dataLayer.push():
forwardToMetaPixel(fullPayload);
forwardToLinkedIn(fullPayload);
```

---

## Scroll Depth Tracking

`useScrollDepth()` is called in `App.tsx`. It automatically:
- Fires `scroll_depth` at 25%, 50%, 75%, 100%
- Each milestone fires **once per page load**
- Detects which section is visible when the milestone fires
- Uses `requestAnimationFrame` throttling (no performance impact)

---

## Event Auto-Metadata

Every event automatically includes:

| Field | Value | Example |
|---|---|---|
| `timestamp` | ISO 8601 string | `"2026-07-07T01:42:00.000Z"` |
| `page` | URL path + query | `"/"` |
| `device_type` | `desktop\|tablet\|mobile` | `"desktop"` |
| `viewport` | WxH string | `"1440x900"` |

These are added by `buildAutoMetadata()` in `events.ts`.
