import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../store';
import { resetGame } from '../store/gameSlice';

const ResultsModal: React.FC = () => {
  const dispatch = useDispatch();
  const { gameCompleted, metrics, config } = useSelector((state: RootState) => state.game);

  const getPersonalityMessage = () => {
    // Clamp age between 1 and 18 (like the HTML version)
    const age = Math.max(1, Math.min(18, config.playerAge));
    
    const youngPersonalities = [
      "Curious explorer! You love trying everything.",
      "Bright spark! Your energy lights up the game.",
      "Steady star! You keep going with great focus.",
      "Playful adventurer! You dive into the fun.",
      "Quick learner! You're catching on fast.",
      "Joyful jumper! You make every pop count.",
      "Bouncy buddy! Your enthusiasm is awesome."
    ];
    
    const olderPersonalities = [
      "Sharp strategist! You plan your moves well.",
      "Lightning leader! Your speed is impressive.",
      "Focused force! Your precision stands out.",
      "Bold blaster! You tackle challenges head-on.",
      "Steady striker! You maintain great control.",
      "Dynamic driver! Your energy powers through.",
      "Resilient racer! You keep pushing forward."
    ];

    const personalities = age < 12 ? youngPersonalities : olderPersonalities;
    return personalities[Math.floor(Math.random() * personalities.length)];
  };

  const handlePlayAgain = () => {
    dispatch(resetGame());
  };

  return (
    <AnimatePresence>
      {gameCompleted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="child-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="gradient-text text-3xl mb-2">
                Great job, {config.playerName}!
              </h2>
              <p className="text-gray-600 text-lg">
                Here are your awesome results! 🏆
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{metrics.hits}</div>
                <div className="text-sm text-green-700">Bubbles Popped! 🎯</div>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{metrics.accuracy.toFixed(0)}%</div>
                <div className="text-sm text-blue-700">Accuracy 🎪</div>
              </div>
              <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">{metrics.avgReactionTime.toFixed(0)}ms</div>
                <div className="text-sm text-purple-700">Speed ⚡</div>
              </div>
              <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-orange-600">{metrics.bestStreak}</div>
                <div className="text-sm text-orange-700">Best Streak 🔥</div>
              </div>
              <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-pink-600">{metrics.targetsPerMinute.toFixed(1)}</div>
                <div className="text-sm text-pink-700">Per Minute 📈</div>
              </div>
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-red-600">{metrics.misses}</div>
                <div className="text-sm text-red-700">Misses 😅</div>
              </div>
            </div>

            {/* Personality Message */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-dashed border-primary/30 rounded-2xl p-6 mb-6">
              <p className="text-lg text-center font-medium text-gray-700">
                {getPersonalityMessage()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayAgain}
                className="child-button flex-1"
              >
                🚀 Play Again!
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const csvData = `Name,Icon,Hits,Misses,Accuracy,AvgRT,BestStreak,TPM\n${config.playerName},${config.icon},${metrics.hits},${metrics.misses},${metrics.accuracy.toFixed(2)},${metrics.avgReactionTime.toFixed(0)},${metrics.bestStreak},${metrics.targetsPerMinute.toFixed(2)}`;
                  const blob = new Blob([csvData], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${config.playerName}-bubble-results.csv`;
                  a.click();
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 text-lg flex-1"
              >
                📊 Save Results
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultsModal;