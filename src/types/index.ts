export interface GameConfig {
  playerName: string;
  icon: string;
  gameTime: number;
  bubbleCount: number;
  playerAge: number;
}

export interface GameMetrics {
  hits: number;
  misses: number;
  streak: number;
  bestStreak: number;
  targetSpawns: number;
  reactionTimes: number[];
  taps: number;
  accuracy: number;
  avgReactionTime: number;
  targetsPerMinute: number;
}

export interface Bubble {
  id: string;
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  text: string;
  icon: string;
  isTarget: boolean;
  birth: number;
  alpha: number;
  color: string;
}