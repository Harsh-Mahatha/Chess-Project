/**
 * analytics/index.ts
 *
 * Public API barrel for the XLChess analytics module.
 *
 * Components should import ONLY from '../analytics' (or '../../analytics').
 * Never import directly from submodules like '../analytics/events'.
 *
 * Example usage:
 *   import { trackEvent, EVENTS } from '../analytics';
 *
 *   trackEvent({ event: EVENTS.HERO_CTA_CLICK, button_name: 'play', destination: '#interactive-demo' });
 */

export { initGTM, isGTMInitialized, getDataLayer } from './gtm';
export { trackEvent } from './events';
export { trackPageView, setupPageViewTracking } from './pageView';
export { useScrollDepth } from './scrollDepth';
export { useAnalytics } from './useAnalytics';
export { EVENTS, SECTIONS, DIFFICULTY_LABELS, FORMS, PUZZLES } from './constants';
export type {
  TrackEventPayload,
  DataLayerEvent,
  AutoMetadata,
  DeviceType,
  // Individual payloads (for typed helpers in components)
  PageViewPayload,
  PageLoadedPayload,
  SessionStartedPayload,
  FirstInteractionPayload,
  ScrollDepthPayload,
  LogoClickPayload,
  NavbarLinkClickPayload,
  NavbarCTAClickPayload,
  MobileMenuTogglePayload,
  HeroCTAClickPayload,
  HeroSecondaryCTAClickPayload,
  ViewPuzzleClickPayload,
  PartnerCTAClickPayload,
  FooterNavClickPayload,
  SectionViewedPayload,
  FeatureCardViewedPayload,
  FormStartedPayload,
  FormFieldFocusPayload,
  FormValidationErrorPayload,
  FormSubmitSuccessPayload,
  FormSubmitFailurePayload,
  PuzzleStartedPayload,
  PuzzleCompletedPayload,
  PuzzleFailedPayload,
  PuzzleRestartedPayload,
  PuzzleMovedPayload,
  HintUsedPayload,
  CheckmatePayload,
  GameStartedPayload,
  MovePlayedPayload,
  MoveUndonePayload,
  GameResetPayload,
  Chess960StartedPayload,
  DifficultySelectedPayload,
  EngineAnalysisOpenedPayload,
  GameOverPayload,
} from './types';
