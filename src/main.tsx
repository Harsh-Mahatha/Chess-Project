import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initGTM } from './analytics'

// ── Initialize Google Tag Manager once, before React renders ──────────────
// GTM is initialized here so it's available for all components immediately.
// Uses window.dataLayer internally — never directly calls gtag().
initGTM();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
