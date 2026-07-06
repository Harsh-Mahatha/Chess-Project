/**
 * analytics/types.ts
 *
 * Complete TypeScript type definitions for the XLChess analytics layer.
 * Every event payload is fully typed — no `any` or scattered string literals.
 *
 * Architecture: Components never touch window.dataLayer directly.
 * They import TrackEventPayload types and call trackEvent().
 */

// ── Device / viewport helpers ─────────────────────────────────────────────────

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

// ── Base shape pushed to window.dataLayer ─────────────────────────────────────

export interface DataLayerEvent {
  event: string;
  [key: string]: unknown;
}

// ── Shared metadata appended automatically by trackEvent() ────────────────────

export interface AutoMetadata {
  /** ISO timestamp of the event */
  timestamp: string;
  /** Current page path e.g. "/" */
  page: string;
  /** Desktop / tablet / mobile */
  device_type: DeviceType;
  /** e.g. "1440x900" */
  viewport: string;
}

// ── Individual event payload interfaces ───────────────────────────────────────

export interface PageViewPayload {
  event: 'page_view';
  page_path: string;
  page_title: string;
  referrer: string;
}

export interface PageLoadedPayload {
  event: 'page_loaded';
  page_title: string;
}

export interface SessionStartedPayload {
  event: 'session_started';
  referrer: string;
}

export interface FirstInteractionPayload {
  event: 'first_interaction';
  interaction_type: 'click' | 'keydown' | 'touch';
}

// ── Scroll ────────────────────────────────────────────────────────────────────

export interface ScrollDepthPayload {
  event: 'scroll_depth';
  /** 25 | 50 | 75 | 100 */
  scroll_percentage: 25 | 50 | 75 | 100;
  /** Visible section ID e.g. "hero-section" */
  section: string;
  page: string;
}

// ── Navigation / CTA ─────────────────────────────────────────────────────────

export interface LogoClickPayload {
  event: 'logo_click';
  location: 'navbar' | 'footer' | 'hero';
}

export interface NavbarLinkClickPayload {
  event: 'navbar_link_click';
  link_name: string;
  destination: string;
}

export interface NavbarCTAClickPayload {
  event: 'navbar_cta_click';
  button_name: string;
  destination: string;
  location: 'desktop' | 'mobile';
}

export interface MobileMenuTogglePayload {
  event: 'mobile_menu_open' | 'mobile_menu_close';
}

export interface HeroCTAClickPayload {
  event: 'hero_cta_click';
  button_name: string;
  destination: string;
}

export interface HeroSecondaryCTAClickPayload {
  event: 'hero_secondary_cta_click';
  button_name: string;
  destination: string;
}

export interface ViewPuzzleClickPayload {
  event: 'view_puzzle_click';
  location: 'navbar' | 'mobile_menu';
}

export interface PartnerCTAClickPayload {
  event: 'partner_cta_click';
  button_name: string;
  section: string;
}

export interface FooterNavClickPayload {
  event: 'footer_nav_click';
  link_name: string;
  destination: string;
}

// ── Section visibility ────────────────────────────────────────────────────────

export interface SectionViewedPayload {
  event: 'section_viewed';
  section_id: string;
  section_name: string;
}

export interface FeatureCardViewedPayload {
  event: 'feature_card_viewed';
  card_title: string;
  card_index: number;
}

// ── Contact Form ──────────────────────────────────────────────────────────────

export interface FormStartedPayload {
  event: 'contact_form_started';
  form_name: string;
  page: string;
}

export interface FormFieldFocusPayload {
  event: 'contact_form_field_focus';
  form_name: string;
  field_name: string;
}

export interface FormValidationErrorPayload {
  event: 'contact_form_validation_error';
  form_name: string;
  field: string;
  error_message: string;
}

export interface FormSubmitSuccessPayload {
  event: 'contact_form_submit_success';
  form_name: string;
  page: string;
}

export interface FormSubmitFailurePayload {
  event: 'contact_form_submit_failure';
  form_name: string;
  page: string;
  error?: string;
}

// ── Chess / Puzzle (HeroPuzzle) ───────────────────────────────────────────────

export interface PuzzleStartedPayload {
  event: 'puzzle_started';
  puzzle_id: string;
  difficulty?: string;
}

export interface PuzzleCompletedPayload {
  event: 'puzzle_completed';
  puzzle_id: string;
  time_taken_seconds: number;
  moves_used: number;
}

export interface PuzzleFailedPayload {
  event: 'puzzle_failed';
  puzzle_id: string;
  moves_used: number;
}

export interface PuzzleRestartedPayload {
  event: 'puzzle_restarted';
  puzzle_id: string;
}

export interface PuzzleMovedPayload {
  event: 'puzzle_move_played';
  from: string;
  to: string;
  san: string;
  move_number: number;
  puzzle_id: string;
}

export interface HintUsedPayload {
  event: 'hint_used';
  context: 'puzzle' | 'game';
  page: string;
}

export interface CheckmatePayload {
  event: 'checkmate';
  context: 'puzzle' | 'game';
  winner?: 'white' | 'black' | 'player' | 'engine';
}

// ── Chess Game (ProductDemo) ──────────────────────────────────────────────────

export interface GameStartedPayload {
  event: 'game_started';
  mode: 'standard' | 'chess960' | 'custom_position';
  difficulty_level: number;
  difficulty_label: string;
}

export interface MovePlayedPayload {
  event: 'move_played';
  from: string;
  to: string;
  san: string;
  move_number: number;
  player: 'human' | 'engine';
}

export interface MoveUndonePayload {
  event: 'move_undone';
  move_count_before: number;
}

export interface GameResetPayload {
  event: 'game_reset';
  move_count: number;
}

export interface Chess960StartedPayload {
  event: 'chess960_started';
}

export interface DifficultySelectedPayload {
  event: 'difficulty_selected';
  level: number;
  label: string;
  previous_level: number;
}

export interface EngineAnalysisOpenedPayload {
  event: 'engine_analysis_opened';
}

export interface GameOverPayload {
  event: 'game_over';
  reason: string;
  move_count: number;
}

// ── Master union ──────────────────────────────────────────────────────────────

export type TrackEventPayload =
  | PageViewPayload
  | PageLoadedPayload
  | SessionStartedPayload
  | FirstInteractionPayload
  | ScrollDepthPayload
  | LogoClickPayload
  | NavbarLinkClickPayload
  | NavbarCTAClickPayload
  | MobileMenuTogglePayload
  | HeroCTAClickPayload
  | HeroSecondaryCTAClickPayload
  | ViewPuzzleClickPayload
  | PartnerCTAClickPayload
  | FooterNavClickPayload
  | SectionViewedPayload
  | FeatureCardViewedPayload
  | FormStartedPayload
  | FormFieldFocusPayload
  | FormValidationErrorPayload
  | FormSubmitSuccessPayload
  | FormSubmitFailurePayload
  | PuzzleStartedPayload
  | PuzzleCompletedPayload
  | PuzzleFailedPayload
  | PuzzleRestartedPayload
  | PuzzleMovedPayload
  | HintUsedPayload
  | CheckmatePayload
  | GameStartedPayload
  | MovePlayedPayload
  | MoveUndonePayload
  | GameResetPayload
  | Chess960StartedPayload
  | DifficultySelectedPayload
  | EngineAnalysisOpenedPayload
  | GameOverPayload;
