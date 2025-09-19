import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../store';
import { setConfig, startGame } from '../store/gameSlice';

const iconOptions = [
  '🐝 Bee', '🌞 Sun', '🌟 Star', '🍀 Clover', '🐾 Paw', '🐦 Bird',
  '✨ Sparkle', '🌈 Rainbow', '⭐ Star', '🐬 Dolphin', '🦋 Butterfly', '🌻 Flower'
];

const GameSetup: React.FC = () => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.game.config);

  const handleInputChange = (field: keyof typeof config, value: string | number) => {
    dispatch(setConfig({ [field]: value }));
  };

  const handleStartGame = () => {
    if (!config.playerName.trim()) {
      alert('Please enter your name! 😊');
      return;
    }
    dispatch(startGame());
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Carnival Elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-10 left-10 text-4xl"
        >
          🎪
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          className="absolute top-20 right-16 text-3xl"
        >
          🎠
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, -25, 0],
            rotate: [0, -10, 10, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 left-20 text-3xl"
        >
          🎡
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, -18, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
          className="absolute bottom-32 right-12 text-3xl"
        >
          🎭
        </motion.div>

        {/* Floating Bubbles */}
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-32 left-1/4 text-2xl opacity-70"
        >
          🫧
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, -25, 0],
            x: [0, -10, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 2 }}
          className="absolute top-40 right-1/3 text-xl opacity-60"
        >
          💧
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, -35, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.8 }}
          className="absolute bottom-40 left-1/3 text-2xl opacity-80"
        >
          🫧
        </motion.div>

        {/* Party Poppers */}
        <motion.div
          animate={{ 
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-16 left-1/2 text-2xl"
        >
          🎉
        </motion.div>

        <motion.div
          animate={{ 
            rotate: [0, -20, 20, 0],
            y: [0, -10, 0]
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-16 right-1/4 text-2xl"
        >
          🎊
        </motion.div>

        {/* Confetti */}
        <motion.div
          animate={{ 
            y: [0, -40, 0],
            rotate: [0, 360]
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-24 right-1/2 text-xl opacity-70"
        >
          ✨
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, -360]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          className="absolute bottom-28 left-1/2 text-xl opacity-80"
        >
          🌟
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-lg w-full p-8 border-4 border-white/50"
        >
          {/* Header */}
          <div className="text-center mb-6">
            {/* OBI Logo and Tagline */}
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/obi-logo.svg" 
                alt="OBI Logo" 
                className="h-8 w-auto mr-2"
              />
              <span className="text-sm font-bold text-purple-700 tracking-wide">
                CARNIVAL PRESENTS
              </span>
            </div>

            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-4"
            >
              💧
            </motion.div>
            
            <motion.h1 
              className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent text-4xl font-bold mb-4"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Pop the bubbles!
            </motion.h1>
            
            {/* Highlighted Message */}
            <motion.div 
              className="bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 border-3 border-orange-400 rounded-2xl p-4 mb-6 shadow-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-white/90 rounded-xl p-4">
                <p className="text-gray-800 font-semibold text-sm mb-3 leading-relaxed">
                  🎯 Tap or click the bubbles that show your name icon. Other bubbles are decoys. Pop as many as you can before time runs out!
                </p>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-4 py-2 rounded-full inline-block font-bold shadow-md">
                  📊 Metrics: hand-eye score, accuracy, reaction time, targets/min, streak, misses
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Player Name */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Name 👋
              </label>
              <input
                type="text"
                value={config.playerName}
                onChange={(e) => handleInputChange('playerName', e.target.value)}
                placeholder="Enter your awesome name!"
                className="w-full p-3 text-sm rounded-xl border-3 border-purple-200 focus:border-purple-500 focus:outline-none transition-all duration-200 bg-white shadow-md"
              />
            </motion.div>

            {/* Icon Picker */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Icon ✨
              </label>
              <select
                value={config.icon}
                onChange={(e) => handleInputChange('icon', e.target.value)}
                className="w-full p-3 text-sm rounded-xl border-3 border-purple-200 focus:border-purple-500 focus:outline-none transition-all duration-200 bg-white shadow-md"
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Game Settings Grid */}
            <div className="grid grid-cols-3 gap-3">
              <motion.div whileHover={{ scale: 1.05 }}>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Time ⏰
                </label>
                <input
                  type="number"
                  value={config.gameTime}
                  onChange={(e) => handleInputChange('gameTime', parseInt(e.target.value))}
                  min="15"
                  max="180"
                  className="w-full p-2 text-sm rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-all duration-200 bg-white shadow-sm"
                />
                <span className="text-xs text-gray-500">sec</span>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Bubbles 🫧
                </label>
                <input
                  type="number"
                  value={config.bubbleCount}
                  onChange={(e) => handleInputChange('bubbleCount', parseInt(e.target.value))}
                  min="1"
                  max="25"
                  className="w-full p-2 text-sm rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-all duration-200 bg-white shadow-sm"
                />
                <span className="text-xs text-gray-500">count</span>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Age 🎂
                </label>
                <input
                  type="number"
                  value={config.playerAge}
                  onChange={(e) => handleInputChange('playerAge', parseInt(e.target.value))}
                  min="1"
                  max="18"
                  className="w-full p-2 text-sm rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-all duration-200 bg-white shadow-sm"
                />
                <span className="text-xs text-gray-500">yrs</span>
              </motion.div>
            </div>

            {/* Start Button */}
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartGame}
              className="w-full mt-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform transition-all duration-200 text-lg"
            >
              🚀 Start the Carnival Adventure!
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GameSetup;