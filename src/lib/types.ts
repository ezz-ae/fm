export enum AppState {
  IDLE,
  CALIBRATING,
  FREQUENCY_CONTENT,
  DRAWING,
  RELEASE,
  FIELD,
  CHOICE,
  NOTEBOOK_ENTRY,
  NOTEBOOK_DRAWING,
  MEMORY_GAME,
  LIFE_FREQUENCY,
  MAZE_CHALLENGE,
  INTEREST_SELECTION,
  INSTAGRAM_PROMPT,
  EMAIL_CAPTURE,
  CODE_VERIFICATION,
  VALUATION,
  FADE_TO_BLACK,
  SECOND_CHANCE,
  RESET,
}

export interface StrokeMetrics {
  duration: number;
  density: number;
  pauseCount: number;
  velocityVariance: number;
  pressureEstimate: number;
  excitementLevel: number;
}
