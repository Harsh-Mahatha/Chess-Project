export type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface DifficultyConfig {
  level: DifficultyLevel;
  name: string;
  rating: number;        // ELO rating label
  skillLevel: number;    // Stockfish "Skill Level" option (0 - 20)
  depth: number;         // Engine depth limit
  timeLimit: number;     // Engine time limit in ms
  description: string;
}

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  1: {
    level: 1,
    name: "Beginner",
    rating: 600,
    skillLevel: 0,
    depth: 1,
    timeLimit: 150,
    description: "Ideal for players learning the basic concepts."
  },
  2: {
    level: 2,
    name: "Easy",
    rating: 1000,
    skillLevel: 3,
    depth: 3,
    timeLimit: 300,
    description: "A friendly sparring partner for casual play."
  },
  3: {
    level: 3,
    name: "Intermediate",
    rating: 1400,
    skillLevel: 8,
    depth: 6,
    timeLimit: 600,
    description: "Plays steady club-level chess with fewer blunders."
  },
  4: {
    level: 4,
    name: "Advanced",
    rating: 1800,
    skillLevel: 13,
    depth: 10,
    timeLimit: 1200,
    description: "A formidable challenger with positional awareness."
  },
  5: {
    level: 5,
    name: "Strong",
    rating: 2200,
    skillLevel: 17,
    depth: 14,
    timeLimit: 2000,
    description: "Near-expert level. Expects tactical accuracy."
  },
  6: {
    level: 6,
    name: "Master",
    rating: 2500,
    skillLevel: 19,
    depth: 18,
    timeLimit: 3000,
    description: "Master-strength play with deep positional understanding."
  },
  7: {
    level: 7,
    name: "Full Strength",
    rating: 2800,
    skillLevel: 20,
    depth: 24,
    timeLimit: 5000,
    description: "Maximum engine power. Virtually unbeatable."
  }
};

export interface EngineEvaluation {
  type: 'cp' | 'mate';
  value: number; // centipawns or moves to mate
}

export type EngineStatus = 'idle' | 'ready' | 'thinking' | 'analyzing' | 'error';

export interface MoveLogEntry {
  san: string;        // Standard Algebraic Notation, e.g. "e4"
  from: string;       // e.g. "e2"
  to: string;         // e.g. "e4"
  color: 'w' | 'b';
  piece: string;      // e.g. "p"
  moveNumber: number;
}
