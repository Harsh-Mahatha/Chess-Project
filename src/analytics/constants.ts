/**
 * analytics/constants.ts
 *
 * Single source of truth for all event names and category labels.
 * Use these constants everywhere — never hardcode event name strings.
 *
 * Naming convention: snake_case, verb_noun pattern where possible.
 */

// ── Event names ───────────────────────────────────────────────────────────────

export const EVENTS = {
  // ── Session & Page ──────────────────────────────────────────────────────
  PAGE_VIEW:           'page_view',
  PAGE_LOADED:         'page_loaded',
  SESSION_STARTED:     'session_started',
  FIRST_INTERACTION:   'first_interaction',

  // ── Scroll ──────────────────────────────────────────────────────────────
  SCROLL_DEPTH:        'scroll_depth',

  // ── Navigation ──────────────────────────────────────────────────────────
  LOGO_CLICK:          'logo_click',
  NAVBAR_LINK_CLICK:   'navbar_link_click',
  NAVBAR_CTA_CLICK:    'navbar_cta_click',
  MOBILE_MENU_OPEN:    'mobile_menu_open',
  MOBILE_MENU_CLOSE:   'mobile_menu_close',
  VIEW_PUZZLE_CLICK:   'view_puzzle_click',

  // ── CTA ─────────────────────────────────────────────────────────────────
  HERO_CTA_CLICK:           'hero_cta_click',
  HERO_SECONDARY_CTA_CLICK: 'hero_secondary_cta_click',
  PARTNER_CTA_CLICK:        'partner_cta_click',
  FOOTER_NAV_CLICK:         'footer_nav_click',

  // ── Section visibility ───────────────────────────────────────────────────
  SECTION_VIEWED:       'section_viewed',
  FEATURE_CARD_VIEWED:  'feature_card_viewed',

  // ── Contact Form ─────────────────────────────────────────────────────────
  FORM_STARTED:            'contact_form_started',
  FORM_FIELD_FOCUS:        'contact_form_field_focus',
  FORM_VALIDATION_ERROR:   'contact_form_validation_error',
  FORM_SUBMIT_SUCCESS:     'contact_form_submit_success',
  FORM_SUBMIT_FAILURE:     'contact_form_submit_failure',

  // ── Chess Puzzle (HeroPuzzle) ─────────────────────────────────────────
  PUZZLE_STARTED:      'puzzle_started',
  PUZZLE_COMPLETED:    'puzzle_completed',
  PUZZLE_FAILED:       'puzzle_failed',
  PUZZLE_RESTARTED:    'puzzle_restarted',
  PUZZLE_MOVE_PLAYED:  'puzzle_move_played',
  HINT_USED:           'hint_used',
  CHECKMATE:           'checkmate',

  // ── Chess Game (ProductDemo) ─────────────────────────────────────────
  GAME_STARTED:           'game_started',
  MOVE_PLAYED:            'move_played',
  MOVE_UNDONE:            'move_undone',
  GAME_RESET:             'game_reset',
  CHESS960_STARTED:       'chess960_started',
  DIFFICULTY_SELECTED:    'difficulty_selected',
  ENGINE_ANALYSIS_OPENED: 'engine_analysis_opened',
  GAME_OVER:              'game_over',
} as const;

export type EventName = typeof EVENTS[keyof typeof EVENTS];

// ── Section IDs (match actual DOM ids) ───────────────────────────────────────

export const SECTIONS = {
  HERO:            'hero-section',
  WHY_OWNERSHIP:   'why-ownership',
  HOW_IT_WORKS:    'how-it-works',
  INTERACTIVE_DEMO:'interactive-demo',
  PARTNER_CTA:     'partner-cta',
} as const;

// ── Difficulty level labels (mirrors DIFFICULTY_CONFIGS in types/chess.ts) ───

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Beginner',
  2: 'Easy',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Master',
};

// ── Form names ────────────────────────────────────────────────────────────────

export const FORMS = {
  CONTACT: 'contact_partner_form',
} as const;

// ── Puzzle IDs ────────────────────────────────────────────────────────────────

export const PUZZLES = {
  HERO_PUZZLE: 'hero_mate_in_2',
} as const;
