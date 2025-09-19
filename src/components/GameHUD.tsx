import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../store';
import { resetGame } from '../store/gameSlice';

const GameHUD: React.FC = () => {
  const dispatch = useDispatch();
  const { metrics, config, isPlaying } = useSelector((state: RootState) => state.game);

  const handleExitGame = () => {
    dispatch(resetGame());
  };

  if (!isPlaying) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Top HUD - moved higher and made more compact */}
      <div className="absolute top-1 left-2 right-2 flex justify-between items-start pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="text-lg">{config.icon.split(' ')[0]}</div>
            <div>
              <div className="font-bold text-sm gradient-text">{config.playerName}</div>
              <div className="text-xs text-gray-600">Pop your bubbles!</div>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExitGame}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full shadow-lg text-sm"
        >
          ❌ Exit
        </motion.button>
      </div>

      {/* Stats HUD - moved to very bottom and made more compact */}
      <div className="absolute bottom-1 left-2 right-2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2 shadow-lg">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">{metrics.hits}</div>
              <div className="text-xs text-gray-600">Hits</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">{metrics.misses}</div>
              <div className="text-xs text-gray-600">Misses</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">{metrics.accuracy.toFixed(0)}%</div>
              <div className="text-xs text-gray-600">Accuracy</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">{metrics.avgReactionTime.toFixed(0)}ms</div>
              <div className="text-xs text-gray-600">Avg RT</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-600">{metrics.targetsPerMinute.toFixed(1)}</div>
              <div className="text-xs text-gray-600">Targets/min</div>
            </div>
            <div>
              <div className="text-lg font-bold text-pink-600">{metrics.streak}</div>
              <div className="text-xs text-gray-600">Streak</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;