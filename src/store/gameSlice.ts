import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameConfig, GameMetrics } from '../types';

interface GameState {
  config: GameConfig;
  metrics: GameMetrics;
  isPlaying: boolean;
  gameStarted: boolean;
  gameCompleted: boolean;
}

const initialState: GameState = {
  config: {
    playerName: '',
    icon: '🐝 Bee',
    gameTime: 45,
    bubbleCount: 7,
    playerAge: 5,
  },
  metrics: {
    hits: 0,
    misses: 0,
    streak: 0,
    bestStreak: 0,
    targetSpawns: 0,
    reactionTimes: [],
    taps: 0,
    accuracy: 0,
    avgReactionTime: 0,
    targetsPerMinute: 0,
  },
  isPlaying: false,
  gameStarted: false,
  gameCompleted: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<Partial<GameConfig>>) => {
      state.config = { ...state.config, ...action.payload };
    },
    startGame: (state) => {
      state.isPlaying = true;
      state.gameStarted = true;
      state.gameCompleted = false;
      state.metrics = initialState.metrics;
    },
    endGame: (state) => {
      state.isPlaying = false;
      state.gameCompleted = true;
    },
    updateMetrics: (state, action: PayloadAction<Partial<GameMetrics>>) => {
      state.metrics = { ...state.metrics, ...action.payload };
    },
    resetGame: (state) => {
      state.isPlaying = false;
      state.gameStarted = false;
      state.gameCompleted = false;
      state.metrics = initialState.metrics;
    },
  },
});

export const { setConfig, startGame, endGame, updateMetrics, resetGame } = gameSlice.actions;
export default gameSlice.reducer;